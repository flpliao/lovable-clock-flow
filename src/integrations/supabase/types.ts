export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      announcement_reads: {
        Row: {
          announcement_id: string | null
          created_at: string
          id: string
          read_at: string
          user_id: string | null
        }
        Insert: {
          announcement_id?: string | null
          created_at?: string
          id?: string
          read_at?: string
          user_id?: string | null
        }
        Update: {
          announcement_id?: string | null
          created_at?: string
          id?: string
          read_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "announcement_reads_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "announcement_reads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          category: string | null
          company_id: string | null
          content: string
          created_at: string
          created_by_id: string | null
          created_by_name: string
          file_name: string | null
          file_type: string | null
          file_url: string | null
          id: string
          is_active: boolean
          is_pinned: boolean
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          company_id?: string | null
          content: string
          created_at?: string
          created_by_id?: string | null
          created_by_name: string
          file_name?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_active?: boolean
          is_pinned?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          company_id?: string | null
          content?: string
          created_at?: string
          created_by_id?: string | null
          created_by_name?: string
          file_name?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_active?: boolean
          is_pinned?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "announcements_created_by_id_fkey"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      annual_leave_balance: {
        Row: {
          created_at: string
          id: string
          remaining_days: number | null
          staff_id: string | null
          total_days: number
          updated_at: string
          used_days: number
          user_id: string | null
          year: number
        }
        Insert: {
          created_at?: string
          id?: string
          remaining_days?: number | null
          staff_id?: string | null
          total_days?: number
          updated_at?: string
          used_days?: number
          user_id?: string | null
          year: number
        }
        Update: {
          created_at?: string
          id?: string
          remaining_days?: number | null
          staff_id?: string | null
          total_days?: number
          updated_at?: string
          used_days?: number
          user_id?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "annual_leave_balance_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "annual_leave_balance_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_records: {
        Row: {
          approval_date: string | null
          approver_id: string | null
          approver_name: string
          comment: string | null
          created_at: string
          id: string
          leave_request_id: string | null
          level: number
          status: string
          updated_at: string
        }
        Insert: {
          approval_date?: string | null
          approver_id?: string | null
          approver_name: string
          comment?: string | null
          created_at?: string
          id?: string
          leave_request_id?: string | null
          level: number
          status?: string
          updated_at?: string
        }
        Update: {
          approval_date?: string | null
          approver_id?: string | null
          approver_name?: string
          comment?: string | null
          created_at?: string
          id?: string
          leave_request_id?: string | null
          level?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "approval_records_approver_id_fkey"
            columns: ["approver_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approval_records_leave_request_id_fkey"
            columns: ["leave_request_id"]
            isOneToOne: false
            referencedRelation: "leave_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      branches: {
        Row: {
          address: string
          business_license: string | null
          code: string
          company_id: string
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          manager_contact: string | null
          manager_name: string | null
          name: string
          phone: string
          staff_count: number
          type: string
          updated_at: string
        }
        Insert: {
          address: string
          business_license?: string | null
          code: string
          company_id: string
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          manager_contact?: string | null
          manager_name?: string | null
          name: string
          phone: string
          staff_count?: number
          type: string
          updated_at?: string
        }
        Update: {
          address?: string
          business_license?: string | null
          code?: string
          company_id?: string
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          manager_contact?: string | null
          manager_name?: string | null
          name?: string
          phone?: string
          staff_count?: number
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "branches_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      check_in_records: {
        Row: {
          action: string
          created_at: string
          distance: number | null
          id: string
          ip_address: string | null
          latitude: number | null
          location_name: string | null
          longitude: number | null
          staff_id: string | null
          status: string
          timestamp: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          distance?: number | null
          id?: string
          ip_address?: string | null
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          staff_id?: string | null
          status: string
          timestamp?: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          distance?: number | null
          id?: string
          ip_address?: string | null
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          staff_id?: string | null
          status?: string
          timestamp?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "check_in_records_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string
          business_type: string
          capital: number | null
          created_at: string
          email: string
          established_date: string | null
          id: string
          legal_representative: string
          name: string
          phone: string
          registration_number: string
          updated_at: string
          website: string | null
        }
        Insert: {
          address: string
          business_type: string
          capital?: number | null
          created_at?: string
          email: string
          established_date?: string | null
          id?: string
          legal_representative: string
          name: string
          phone: string
          registration_number: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string
          business_type?: string
          capital?: number | null
          created_at?: string
          email?: string
          established_date?: string | null
          id?: string
          legal_representative?: string
          name?: string
          phone?: string
          registration_number?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      leave_requests: {
        Row: {
          approval_level: number | null
          attachment_url: string | null
          created_at: string
          current_approver: string | null
          end_date: string
          hours: number
          id: string
          leave_type: string
          reason: string
          rejection_reason: string | null
          staff_id: string | null
          start_date: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          approval_level?: number | null
          attachment_url?: string | null
          created_at?: string
          current_approver?: string | null
          end_date: string
          hours: number
          id?: string
          leave_type: string
          reason: string
          rejection_reason?: string | null
          staff_id?: string | null
          start_date: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          approval_level?: number | null
          attachment_url?: string | null
          created_at?: string
          current_approver?: string | null
          end_date?: string
          hours?: number
          id?: string
          leave_type?: string
          reason?: string
          rejection_reason?: string | null
          staff_id?: string | null
          start_date?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_current_approver_fkey"
            columns: ["current_approver"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          category: string
          code: string
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category: string
          code: string
          created_at?: string
          description?: string | null
          id: string
          name: string
        }
        Update: {
          category?: string
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          permission_id: string
          role_id: string
        }
        Insert: {
          permission_id: string
          role_id: string
        }
        Update: {
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "staff_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          branch_id: string
          branch_name: string
          contact: string
          created_at: string
          department: string
          email: string | null
          id: string
          name: string
          position: string
          role: string
          role_id: string
          supervisor_id: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          branch_id: string
          branch_name: string
          contact: string
          created_at?: string
          department: string
          email?: string | null
          id?: string
          name: string
          position: string
          role?: string
          role_id?: string
          supervisor_id?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          branch_id?: string
          branch_name?: string
          contact?: string
          created_at?: string
          department?: string
          email?: string | null
          id?: string
          name?: string
          position?: string
          role?: string
          role_id?: string
          supervisor_id?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_system_role: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id: string
          is_system_role?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_system_role?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_annual_leave_days: {
        Args: { hire_date: string; target_year: number }
        Returns: number
      }
      get_announcement_read_stats: {
        Args: { announcement_uuid: string }
        Returns: {
          total_staff: number
          read_count: number
          unread_count: number
          read_percentage: number
        }[]
      }
      get_current_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      initialize_annual_leave_balance: {
        Args: { staff_uuid: string; target_year: number }
        Returns: undefined
      }
      mark_announcement_as_read: {
        Args: { user_uuid: string; announcement_uuid: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
