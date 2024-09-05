package com.backend.backend;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // Erlaubt CORS für alle Endpunkte
                .allowedOrigins("http://localhost:4200")  // Erlaubt Anfragen von localhost:4200
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // Erlaubt diese HTTP-Methoden
                .allowedHeaders("*")  // Erlaubt alle Header
                .allowCredentials(true)  // Erlaubt das Senden von Cookies/Anmeldeinformationen
                .maxAge(3600);  // Maximale Dauer der Gültigkeit einer Preflight-Anfrage
    }
}