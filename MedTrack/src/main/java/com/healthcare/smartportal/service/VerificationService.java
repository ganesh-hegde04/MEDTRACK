package com.healthcare.smartportal.service;

import com.healthcare.smartportal.model.VerificationToken;
import com.healthcare.smartportal.repository.VerificationTokenRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class VerificationService {

    private final VerificationTokenRepository tokenRepository;

    // Tracks which emails have been verified
    private final Map<String, Boolean> verifiedEmails = new ConcurrentHashMap<>();

    public String generateCode() {
        return String.valueOf((int)(Math.random() * 900000) + 100000); // 6-digit OTP
    }

    @Transactional
    public void saveToken(String email, String code) {
        tokenRepository.deleteByEmail(email); // Ensure uniqueness
        VerificationToken token = new VerificationToken(email, code);
        tokenRepository.save(token);
    }

    public boolean verifyCode(String email, String code) {
        Optional<VerificationToken> optionalToken = tokenRepository.findByEmail(email);
        if (optionalToken.isPresent()) {
            VerificationToken token = optionalToken.get();
            boolean isNotExpired = token.getCreatedAt().isAfter(LocalDateTime.now().minusMinutes(3));
            boolean isValid = token.getCode().equals(code) && isNotExpired;

            if (isValid) {
                markEmailVerified(email);
                return true;
            }
        }
        return false;
    }

    public void markEmailVerified(String email) {
        verifiedEmails.put(email, true);
    }

    public boolean isEmailVerified(String email) {
        return verifiedEmails.getOrDefault(email, false);
    }

    public void clearVerificationStatus(String email) {
        verifiedEmails.remove(email);
    }
}
