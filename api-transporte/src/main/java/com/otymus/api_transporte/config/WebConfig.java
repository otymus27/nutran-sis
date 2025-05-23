// package com.otymus.api_transporte.config;

// import org.springframework.context.annotation.Configuration;
// import org.springframework.web.servlet.config.annotation.CorsRegistry;
// import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// @Configuration
// public class WebConfig implements WebMvcConfigurer {

//     @Override
//     public void addCorsMappings(CorsRegistry registry) {
//         System.out.println("CORS configurado!");
//         registry.addMapping("/**")
//                 //.allowedOrigins("http://10.85.190.175:3000") // Define um domínio específico
//                 .allowedOrigins("*")
//                 //.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
//                 .allowedMethods("*")
//                 .allowedHeaders("*")
//                 .exposedHeaders("*")
//                 //.allowCredentials(true) // Permitir envio de cookies e credenciais
//                 .maxAge(3600); // Cache para preflight request
//     }
// }
