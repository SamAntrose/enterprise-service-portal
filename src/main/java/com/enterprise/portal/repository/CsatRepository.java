package com.enterprise.portal.repository;

import com.enterprise.portal.model.CsatRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CsatRepository extends JpaRepository<CsatRating, Long> {
    Optional<CsatRating> findByTicketId(Long ticketId);
    List<CsatRating> findAllByOrderBySubmittedAtDesc();
}
