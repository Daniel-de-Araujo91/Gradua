package br.com.ufal.gradua.dtos.forum;

import java.time.LocalDateTime;
import java.util.UUID;

public record ForumVoteResponseDTO(
    UUID voteId,
    UUID topicId, 
    String type,
    String authorName
){}
