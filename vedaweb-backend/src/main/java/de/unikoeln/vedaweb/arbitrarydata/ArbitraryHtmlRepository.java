package de.unikoeln.vedaweb.arbitrarydata;

import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ArbitraryHtmlRepository extends MongoRepository<ArbitraryHtml, String> {
    public Optional<ArbitraryHtml> findById(String id);
}
 