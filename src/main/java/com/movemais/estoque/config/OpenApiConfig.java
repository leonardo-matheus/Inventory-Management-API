package com.movemais.estoque.config;

import io.swagger.v3.oas.models.info.Info;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.*;

@Configuration
public class OpenApiConfig {

    @Bean
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
                .group("inventory")
                .pathsToMatch("/**")
                .addOpenApiCustomizer(openApi -> openApi.setInfo(new Info()
                        .title("Inventory Management API")
                        .version("1.0.0")))
                .build();
    }
}