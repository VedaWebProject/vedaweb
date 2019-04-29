package de.unikoeln.vedaweb.document;

import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface StanzaXmlRepository extends MongoRepository<StanzaXml, String> {
    public Optional<StanzaXml> findById(String id);
}
 