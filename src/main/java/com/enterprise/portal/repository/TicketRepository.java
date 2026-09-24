package com.enterprise.portal.repository;

import com.enterprise.portal.model.Ticket;
import com.enterprise.portal.model.TicketPriority;
import com.enterprise.portal.model.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    Optional<Ticket> findByTicketCode(String ticketCode);

    List<Ticket> findByRequesterId(Long requesterId);

    List<Ticket> findByAssignedTechId(Long techId);

    List<Ticket> findByStatus(TicketStatus status);

    List<Ticket> findByPriority(TicketPriority priority);

    List<Ticket> findByMajorIncidentTrue();

    @Query("SELECT t FROM Ticket t ORDER BY t.createdAt DESC")
    List<Ticket> findAllByOrderByCreatedAtDesc();

    long countByStatus(TicketStatus status);
}
