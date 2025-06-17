package hhn.mim.sswem.backend;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;

@RestController
@RequestMapping("/api")
public class BackendController {

    private static final String USERS_FILE = "users.json";

    @Autowired
    private RecaptchaService recaptchaService;

    Argon2PasswordEncoder arg2SpringSecurity = new Argon2PasswordEncoder(16, 32, 1, 60000, 10);

    @PostMapping("/register")
    public String register(@RequestBody User user, @RequestParam String token) throws Exception {
        if (!recaptchaService.verify(token)) {
            return "recaptcha_failed";
        }

        String username = user.getUsername();
        String password = user.getPassword();

        String validationError = validatePassword(password);
        if (validationError != null) {
            return validationError;
        }

        if (isPasswordPwned(password)) {
            return "password_pwned";
        }

        String passwordHash = hashPassword(password);

        user.setPassword(passwordHash);

        saveUserToJson(user);
        return "success";
    }

    @PostMapping("/login")
    public String login(@RequestBody User user, @RequestParam String token) throws Exception {
        if (!recaptchaService.verify(token)) {
            return "recaptcha_failed";
        }

        String username = user.getUsername();
        String password = user.getPassword();

        File jsonFile = new File("users.json");
        if (!jsonFile.exists()) return "invalid";

        ObjectMapper objectMapper = new ObjectMapper();
        User[] users = objectMapper.readValue(jsonFile, User[].class);

        for (User storedUser : users) {
            if (storedUser.getUsername().equals(username)) {
                if (arg2SpringSecurity.matches(password, storedUser.getPassword())) {
                    return "success";
                } else {
                    return "invalid";
                }
            }
        }

        return "invalid";
    }

    private String hashPassword(String password) throws Exception {
        return arg2SpringSecurity.encode(password);
    }

    private String validatePassword(String pwd) {
        if (pwd.length() < 8) return "password_too_short";
        if (!pwd.matches(".*[A-Z].*")) return "missing_uppercase";
        if (!pwd.matches(".*[a-z].*")) return "missing_lowercase";
        if (!pwd.matches(".*\\d.*")) return "missing_number";
        if (!pwd.matches(".*[-+_!@#$%^&*.,?].*")) return "missing_special_char";
        return null;
    }

    private boolean isPasswordPwned(String password) throws Exception {
        MessageDigest sha1 = MessageDigest.getInstance("SHA-1");
        byte[] hashBytes = sha1.digest(password.getBytes("UTF-8"));

        StringBuilder sb = new StringBuilder();
        for (byte b : hashBytes) {
            sb.append(String.format("%02X", b));
        }

        String fullHash = sb.toString();
        String prefix = fullHash.substring(0, 5);
        String suffix = fullHash.substring(5);

        URL url = new URL("https://api.pwnedpasswords.com/range/" + prefix);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");

        BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        String line;
        while ((line = in.readLine()) != null) {
            if (line.startsWith(suffix)) {
                return true;
            }
        }
        return false;
    }

    private void saveUserToJson(User user) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();

        List<User> users = new ArrayList<>();
        File file = new File(USERS_FILE);

        if (file.exists()) {
            users = new ArrayList<>(Arrays.asList(
                    objectMapper.readValue(file, User[].class)
            ));
        }

        users.add(user);

        objectMapper.writerWithDefaultPrettyPrinter().writeValue(file, users);
    }
}
