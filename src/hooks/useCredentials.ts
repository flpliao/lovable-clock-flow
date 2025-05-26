
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseCredentialsProps {
  userId?: string;
  onSuccess?: () => void;
}

export const useCredentials = ({ userId, onSuccess }: UseCredentialsProps) => {
  const { toast } = useToast();
  const [currentEmail, setCurrentEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current email for the user
  useEffect(() => {
    if (userId && window.userCredentialsStore[userId]) {
      const storedEmail = window.userCredentialsStore[userId].email;
      setCurrentEmail(storedEmail);
    }
  }, [userId]);

  const updateEmail = async (email: string): Promise<void> => {
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (userId) {
            // Check if email already exists for another user
            for (const [existingUserId, credentials] of Object.entries(window.userCredentialsStore)) {
              if (existingUserId !== userId && credentials.email.toLowerCase() === email.toLowerCase()) {
                toast({
                  title: "電子郵件已存在",
                  description: "此電子郵件地址已被其他用戶使用",
                  variant: "destructive"
                });
                reject(new Error("Email already exists"));
                return;
              }
            }

            // Initialize if not exists
            if (!window.userCredentialsStore[userId]) {
              window.userCredentialsStore[userId] = {
                userId: userId,
                email: email,
                password: 'password' // Default password
              };
            } else {
              // Update existing
              window.userCredentialsStore[userId].email = email;
            }
            
            // Log for debugging
            console.log('Updated credentials:', window.userCredentialsStore);
            
            setCurrentEmail(email);
            
            toast({
              title: "電子郵件已更新",
              description: "帳號電子郵件地址已成功更新，請使用新的電子郵件地址登錄。",
            });
            
            if (onSuccess) onSuccess();
            resolve();
          } else {
            reject(new Error("No user ID provided"));
          }
        } catch (error) {
          reject(error);
        } finally {
          setIsSubmitting(false);
        }
      }, 1000);
    });
  };

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (userId) {
            // No current password verification needed - directly update password
            
            // Initialize if not exists
            if (!window.userCredentialsStore[userId]) {
              window.userCredentialsStore[userId] = {
                userId: userId,
                email: `user-${userId}@example.com`, // Default email
                password: newPassword
              };
            } else {
              // Update existing
              window.userCredentialsStore[userId].password = newPassword;
            }
            
            // Log for debugging
            console.log('Updated credentials:', window.userCredentialsStore);
            
            toast({
              title: "密碼已更新",
              description: "帳號密碼已成功更新，請使用新密碼登錄。",
            });
            
            if (onSuccess) onSuccess();
            resolve();
          } else {
            reject(new Error("No user ID provided"));
          }
        } catch (error) {
          reject(error);
        } finally {
          setIsSubmitting(false);
        }
      }, 1000);
    });
  };

  return {
    currentEmail,
    isSubmitting,
    updateEmail,
    updatePassword
  };
};
