package com.folio.folio_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatePostRequest {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    private String techStack;
    
    private String liveDemoUrl;
    
    private String githubUrl;
    
    private List<String> screenshotUrls = new ArrayList<>();
    
    private List<String> tags = new ArrayList<>();
    
    // Custom validation method
    public boolean hasMediaContent() {
        return (liveDemoUrl != null && !liveDemoUrl.trim().isEmpty()) ||
               (screenshotUrls != null && !screenshotUrls.isEmpty());
    }
}

