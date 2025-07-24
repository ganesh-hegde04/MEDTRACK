package com.healthcare.smartportal.service;

import jakarta.annotation.PostConstruct;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.SecureRandom;
import java.util.Arrays;
import org.springframework.beans.factory.annotation.Value;

@Component
@Slf4j
public class EncryptionService {

    private static final String ALGORITHM = "AES/CBC/PKCS5Padding";
    private static final int IV_LENGTH = 16;
    private static final int KEY_LENGTH = 32; // 256-bit AES

    // Replace with a securely stored key (e.g., from env var or vault)
    @Value("${encryption.secret-key}")
    private  String rawSecret ;

    private SecretKey secretKey;

    @PostConstruct
    public void init() {
        byte[] keyBytes = rawSecret.getBytes();
        if (keyBytes.length != KEY_LENGTH) {
            throw new IllegalArgumentException("Secret key must be 32 bytes for AES-256.");
        }
        this.secretKey = new SecretKeySpec(keyBytes, "AES");
    }

    public byte[] encrypt(byte[] plainData) throws Exception {
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        byte[] iv = generateIV();
        IvParameterSpec ivSpec = new IvParameterSpec(iv);
        cipher.init(Cipher.ENCRYPT_MODE, secretKey, ivSpec);
        byte[] encrypted = cipher.doFinal(plainData);

        // Combine IV + encrypted data
        byte[] result = new byte[IV_LENGTH + encrypted.length];
        System.arraycopy(iv, 0, result, 0, IV_LENGTH);
        System.arraycopy(encrypted, 0, result, IV_LENGTH, encrypted.length);
        return result;
    }

    public byte[] decrypt(byte[] encryptedData) throws Exception {
        if (encryptedData.length < IV_LENGTH) {
            throw new IllegalArgumentException("Invalid encrypted data");
        }

        byte[] iv = Arrays.copyOfRange(encryptedData, 0, IV_LENGTH);
        byte[] actualEncrypted = Arrays.copyOfRange(encryptedData, IV_LENGTH, encryptedData.length);

        Cipher cipher = Cipher.getInstance(ALGORITHM);
        IvParameterSpec ivSpec = new IvParameterSpec(iv);
        cipher.init(Cipher.DECRYPT_MODE, secretKey, ivSpec);
        return cipher.doFinal(actualEncrypted);
    }

    private byte[] generateIV() {
        byte[] iv = new byte[IV_LENGTH];
        new SecureRandom().nextBytes(iv);
        return iv;
    }
}