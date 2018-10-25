package de.unikoeln.vedaweb.feedback;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FeedbackRepository extends MongoRepository<Feedback, String> {
	
	public List<Feedback> findAll();

}
