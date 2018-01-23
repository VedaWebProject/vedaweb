package de.unikoeln.vedaweb.data;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface VerseRepository extends MongoRepository<VerseDocument, String> {

    public VerseDocument findById(String id);
    public VerseDocument findByIndex(String index);

}
