package de.unikoeln.vedaweb.logging;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface ClientErrorRepository extends MongoRepository<ClientError, String>  {}
