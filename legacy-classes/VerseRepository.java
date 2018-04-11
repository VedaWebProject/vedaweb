package de.unikoeln.vedaweb.legacy;

import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface VerseRepository extends MongoRepository<VerseDocument, String> {
    public Optional<VerseDocument> findById(String id);
    public Optional<VerseDocument> findByIndex(String index);
    public Optional<VerseDocument> findByBookAndHymnAndVerse(Integer book, Integer Hymn, Integer verse);
}
 