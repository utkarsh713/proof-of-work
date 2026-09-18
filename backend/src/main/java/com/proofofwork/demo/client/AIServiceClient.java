package com.proofofwork.demo.client;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
public class AIServiceClient {

    private final RestTemplate restTemplate;

    public AIServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }
    public String verifyComplete(int workId, String workDescription) {

        String url = "http://127.0.0.1:8000/verify-complete";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

        body.add("work_id", String.valueOf(workId));
        body.add("work_description", workDescription);

        HttpEntity<MultiValueMap<String, Object>> request =
                new HttpEntity<>(body, headers);

        return restTemplate.postForObject(
                url,
                request,
                String.class
        );
    }
}  
