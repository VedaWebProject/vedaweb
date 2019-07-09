package de.unikoeln.vedaweb.controllers;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.boot.autoconfigure.web.servlet.error.AbstractErrorController;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class CustomErrorController extends AbstractErrorController {

	public CustomErrorController(ErrorAttributes errorAttributes) {
		super(errorAttributes);
	}

	@RequestMapping(value = "/error", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Map<String, Object> handleError(HttpServletRequest request) {
		Map<String, Object> errorAttributes = super.getErrorAttributes(request, false);
		return errorAttributes;
	}

	@Override
	public String getErrorPath() {
		return "/error";
	}
}