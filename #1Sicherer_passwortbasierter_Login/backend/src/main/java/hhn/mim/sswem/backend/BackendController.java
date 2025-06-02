package hhn.mim.sswem.backend;


import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Scanner;

@RestController
@RequestMapping("/api")
public class BackendController {

    private static final String CSV_PATH = "users.csv";

    @PostMapping("/register")
    public String register(@RequestBody User user) throws IOException {
        FileWriter csvWriter = new FileWriter(CSV_PATH, true);
        csvWriter.append(user.getUsername())
                .append(",")
                .append(user.getPassword())
                .append("\n");
        csvWriter.flush();
        csvWriter.close();
        return "OK";
    }

    @PostMapping("/login")
    public String login(@RequestBody User user) throws IOException {
        File csvFile = new File("users.csv");
        if (!csvFile.exists()) {
            return "invalid"; // Keine Nutzer vorhanden
        }

        Scanner scanner = new Scanner(csvFile);
        while (scanner.hasNextLine()) {
            String line = scanner.nextLine();
            String[] parts = line.split(",", -1);
            if (parts.length == 2) {
                String storedUsername = parts[0];
                String storedPasswordHash = parts[1];
                if (storedUsername.equals(user.getUsername()) &&
                        storedPasswordHash.equals(user.getPassword())) {
                    scanner.close();
                    return "success";
                }
            }
        }
        scanner.close();
        return "invalid";
    }
}
