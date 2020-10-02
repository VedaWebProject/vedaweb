package de.unikoeln.vedaweb.logging;

import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * DB repository interface for client side error data
 * 
 * @author bkis
 *
 */
public interface ClientErrorRepository 
	extends MongoRepository<ClientError, String>  {
	
	// notin
	
}
