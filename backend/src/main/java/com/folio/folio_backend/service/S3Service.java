package com.folio.folio_backend.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface S3Service {
    String uploadProfilePicture(MultipartFile file, Long userId);
    List<String> uploadPostScreenshots(List<MultipartFile> files, Long postId);
    void deleteFile(String fileKey);
    String getPublicUrl(String fileKey);
    String extractKeyFromUrl(String url);
}