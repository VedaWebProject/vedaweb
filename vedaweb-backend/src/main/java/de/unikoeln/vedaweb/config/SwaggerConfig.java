package de.unikoeln.vedaweb.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
public class SwaggerConfig extends WebMvcConfigurationSupport {
	
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
    
    
    @Override
    protected void addResourceHandlers(ResourceHandlerRegistry registry) {
    	registry
	        .addResourceHandler("swagger-ui.html")
	        .addResourceLocations("classpath:/META-INF/resources/");
	    registry
	        .addResourceHandler("/webjars/**")
	        .addResourceLocations("classpath:/META-INF/resources/webjars/");
    }
    

    @Bean
    public RequestMappingHandlerMapping requestMappingHandlerMapping() {
        RequestMappingHandlerMapping handlerMapping = super.requestMappingHandlerMapping();
//        handlerMapping.setUseSuffixPatternMatch(true); // Doesn't seem to have the desired effect, anyway. Keeping it for reference, though.
        handlerMapping.setUseTrailingSlashMatch(true);
        return handlerMapping;
    }

}