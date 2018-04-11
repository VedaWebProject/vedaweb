package de.unikoeln.vedaweb.data;

import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface VerseRepository extends MongoRepository<Verse, String> {
    public Optional<Verse> findById(String id);
    public Optional<Verse> findByIndex(int index);
    public Optional<Verse> findByBookAndHymnAndVerse(Integer book, Integer Hymn, Integer verse);
}
 