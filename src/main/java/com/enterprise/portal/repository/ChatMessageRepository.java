package com.enterprise.portal.repository;

import com.enterprise.portal.model.ChatMessage;
import com.enterprise.portal.model.CsatRating;
import com.enterprise.portal.model.TicketComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByTicketIdOrderByTimestampAsc(Long ticketId);
}
