package de.unikoeln.vedaweb.dictcorrection;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface CorrectionsRepository extends MongoRepository<Correction, String>  {
	
	public Optional<Correction> findByLemma(String lemma);
	public Optional<Correction> findByHeadwordIso(String headwordIso);
	
}
