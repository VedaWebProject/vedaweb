package de.unikoeln.vedaweb.dictcorrection;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface CorrectionsRepository extends MongoRepository<Correction, String>  {
	
	public List<Correction> findAllByLemma(String lemma);
	public Optional<Correction> findByHeadwordIso(String headwordIso);
	
}
