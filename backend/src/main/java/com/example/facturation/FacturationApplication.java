package com.example.facturation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.example.facturation")
public class FacturationApplication {

	public static void main(String[] args) {
		SpringApplication.run(FacturationApplication.class, args);
	}

}
