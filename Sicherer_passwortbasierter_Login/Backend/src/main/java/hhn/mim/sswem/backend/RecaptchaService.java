package hhn.mim.sswem.backend;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class RecaptchaService {

    @Value("${recaptcha.secret}")
    private String recaptchaSecret;

    private final RestTemplate restTemplate = new RestTemplate();

    public boolean verify(String token) {
        String url = "https://www.google.com/recaptcha/api/siteverify";

        Map<String, String> params = new HashMap<>();
        params.put("secret", recaptchaSecret);
        params.put("response", token);

        ResponseEntity<RecaptchaResponse> response =
                restTemplate.postForEntity(
                        url + "?secret={secret}&response={response}",
                        null,
                        RecaptchaResponse.class,
                        params
                );

        return response.getBody() != null && response.getBody().isSuccess();
    }
}
