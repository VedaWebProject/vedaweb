package de.unikoeln.vedaweb.config;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;
import org.springframework.web.servlet.resource.ResourceResolver;
import org.springframework.web.servlet.resource.ResourceResolverChain;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

@Configuration
public class WebMvcConfig extends WebMvcConfigurationSupport {
	
	private Logger logger = LoggerFactory.getLogger(this.getClass());

	
    @Override
    protected void addResourceHandlers(ResourceHandlerRegistry registry) {
    	// general
    	registry
			.addResourceHandler("*")
			.addResourceLocations("classpath:/static/")
			.setCacheControl(CacheControl.maxAge(10 , TimeUnit.HOURS).mustRevalidate()) //set cache-control in header
			.resourceChain(false)
			.addResolver(new PushStateResourceResolver());
    	// for swagger
    	registry
	        .addResourceHandler("swagger-ui.html")
	        .addResourceLocations("classpath:/META-INF/resources/");
    	// for swagger
	    registry
	        .addResourceHandler("/webjars/**")
	        .addResourceLocations("classpath:/META-INF/resources/webjars/");
    }
    
    
    private class PushStateResourceResolver implements ResourceResolver {
		private Resource index = new ClassPathResource("/static/index.html");
		private List<String> handledExtensions = Arrays.asList("html", "htm", "js", "map", "json", "csv", "css", "png", "svg",
				"eot", "ttf", "woff", "appcache", "jpg", "jpeg", "gif", "ico");
		private List<String> ignoredPaths = Arrays.asList("api");

		@Override
		public Resource resolveResource(HttpServletRequest request, String requestPath,
				List<? extends Resource> locations, ResourceResolverChain chain) {
			return resolve(requestPath, locations);
		}

		@Override
		public String resolveUrlPath(String resourcePath, List<? extends Resource> locations,
				ResourceResolverChain chain) {
			Resource resolvedResource = resolve(resourcePath, locations);
			if (resolvedResource == null) {
				return null;
			}
			try {
				return resolvedResource.getURL().toString();
			} catch (IOException e) {
				logger.info("Could not get URL from resource", e);
				return resolvedResource.getFilename();
			}
		}

		private Resource resolve(String requestPath, List<? extends Resource> locations) {
			if (isIgnored(requestPath)) {
				return null;
			}
			if (isHandled(requestPath)) {
				return locations.stream().map(loc -> createRelative(loc, requestPath))
						.filter(resource -> resource != null && resource.exists()).findFirst().orElse(null);
			}
			return index;
		}

		private Resource createRelative(Resource resource, String relativePath) {
			try {
				return resource.createRelative(relativePath);
			} catch (IOException e) {
				logger.info("Could not create resource from relative path", e);
				return null;
			}
		}

		private boolean isIgnored(String path) {
			return ignoredPaths.contains(path);
		}

		private boolean isHandled(String path) {
			String extension = StringUtils.getFilenameExtension(path);
			return handledExtensions.stream().anyMatch(ext -> ext.equals(extension));
		}
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