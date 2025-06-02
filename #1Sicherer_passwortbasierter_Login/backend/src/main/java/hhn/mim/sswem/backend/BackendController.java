package hhn.mim.sswem.backend;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.MessageDigest;
import java.util.Scanner;

@RestController
@RequestMapping("/api")
public class BackendController {

    private static final String CSV_PATH = "users.csv";
    @Autowired
    private RecaptchaService recaptchaService;

    @PostMapping("/register")
    public String register(@RequestBody User user) throws Exception {
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

        FileWriter writer = new FileWriter("users.csv", true);
        writer.append(username).append(",").append(passwordHash).append("\n");
        writer.close();

        return "success";
    }

    @PostMapping("/login")
    public String login(@RequestBody User user ,@RequestParam String token) throws Exception {
        if (!recaptchaService.verify(token)) {
            return "recaptcha_failed";
        }
        String username = user.getUsername();
        String password = user.getPassword();
        String passwordHash = hashPassword(password);

        File csvFile = new File("users.csv");
        if (!csvFile.exists()) return "invalid";

        Scanner scanner = new Scanner(csvFile);
        while (scanner.hasNextLine()) {
            String line = scanner.nextLine();
            String[] parts = line.split(",", -1);
            if (parts.length == 2) {
                String storedUsername = parts[0];
                String storedPasswordHash = parts[1];
                if (storedUsername.equals(username) &&
                        storedPasswordHash.equals(passwordHash)) {
                    scanner.close();
                    return "success";
                }
            }
        }
        scanner.close();
        return "invalid";
    }

    private String hashPassword(String password) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hashBytes = digest.digest(password.getBytes("UTF-8"));
        StringBuilder sb = new StringBuilder();
        for (byte b : hashBytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
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
}
