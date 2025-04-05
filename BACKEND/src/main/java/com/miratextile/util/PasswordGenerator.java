package com.miratextile.util;

import org.springframework.stereotype.Component;
import java.security.SecureRandom;

@Component
public class PasswordGenerator {
    private static final String CHAR_LOWER = "abcdefghijklmnopqrstuvwxyz";
    private static final String CHAR_UPPER = CHAR_LOWER.toUpperCase();
    private static final String NUMBER = "0123456789";
    private static final String SPECIAL = "!@#$%^&*()_+-=[]|,./?><";
    
    private final SecureRandom random = new SecureRandom();

    public String generateSecurePassword() {
        String allChars = CHAR_LOWER + CHAR_UPPER + NUMBER + SPECIAL;
        StringBuilder password = new StringBuilder();
        
        // Ensure at least one character from each category
        password.append(CHAR_LOWER.charAt(random.nextInt(CHAR_LOWER.length())));
        password.append(CHAR_UPPER.charAt(random.nextInt(CHAR_UPPER.length())));
        password.append(NUMBER.charAt(random.nextInt(NUMBER.length())));
        password.append(SPECIAL.charAt(random.nextInt(SPECIAL.length())));
        
        // Fill remaining length with random characters
        while (password.length() < 12) {
            password.append(allChars.charAt(random.nextInt(allChars.length())));
        }
        
        // Shuffle the password
        char[] passwordArray = password.toString().toCharArray();
        for (int i = passwordArray.length - 1; i > 0; i--) {
            int j = random.nextInt(i + 1);
            char temp = passwordArray[i];
            passwordArray[i] = passwordArray[j];
            passwordArray[j] = temp;
        }
        
        return new String(passwordArray);
    }
}