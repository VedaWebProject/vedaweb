package de.unikoeln.vedaweb.config;

import java.util.concurrent.TimeUnit;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

@Configuration
public class WebMvcConfig extends WebMvcConfigurationSupport {
	
	@Override
	public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
	    configurer.favorPathExtension(false);
	}

	
	@Override
	public void configurePathMatch(PathMatchConfigurer matcher) {
	    matcher.setUseSuffixPatternMatch(false);
	}

	
    @Override
    protected void addResourceHandlers(ResourceHandlerRegistry registry) {
    	// general
    	registry
			.addResourceHandler("/**")
			.addResourceLocations("classpath:/static/")
			.setCacheControl(CacheControl.maxAge(10 , TimeUnit.HOURS).mustRevalidate()) //set cache-control in header
			.resourceChain(false);
    	// for swagger
    	registry
	        .addResourceHandler("swagger-ui.html")
	        .addResourceLocations("classpath:/META-INF/resources/");
    	// for swagger
	    registry
	        .addResourceHandler("/webjars/**")
	        .addResourceLocations("classpath:/META-INF/resources/webjars/");
    }
    
    
    //// SWAGGER SPECIFIC CONFIG ////
    
    @Bean
    public Docket api() { 
        return new Docket(DocumentationType.SWAGGER_2)  
          .select()                                  
          .apis(RequestHandlerSelectors.basePackage("de.unikoeln.vedaweb.controllers"))              
          .paths(PathSelectors.regex("/api/(document|search|export)/?.*"))                          
          .build()
          .apiInfo(metaData());
    }
    
    
    private ApiInfo metaData() {
        return new ApiInfoBuilder()
                .title("VedaWeb REST API")
                .description("REST API for the VedaWeb Application")
                //.version("1.0.0")
                //.license("Apache License Version 2.0")
                //.licenseUrl("https://www.apache.org/licenses/LICENSE-2.0\"")
                //.contact(new Contact("The VedaWeb Project Team", "https://vedaweb.uni-koeln.de", "veda-web@uni-koeln.de"))
                .build();
    }
    

}