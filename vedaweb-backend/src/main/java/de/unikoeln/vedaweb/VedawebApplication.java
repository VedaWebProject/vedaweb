package de.unikoeln.vedaweb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import springfox.documentation.swagger2.annotations.EnableSwagger2;

@SpringBootApplication
@EnableAutoConfiguration
@EnableSwagger2
public class VedawebApplication {
	
	public static void main(String[] args) {
		VedaWebBanner.printBanner(); // print cli banner 
		SpringApplication.run(VedawebApplication.class, args);
	}
	
}
