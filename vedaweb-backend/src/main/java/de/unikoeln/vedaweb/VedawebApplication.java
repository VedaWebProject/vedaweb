package de.unikoeln.vedaweb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
@EnableAutoConfiguration
public class VedawebApplication {
	
	public static void main(String[] args) {
		VedaWebBanner.printBanner(); // print cli banner 
		SpringApplication.run(VedawebApplication.class, args);
	}
	
}
