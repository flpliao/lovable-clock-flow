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
      attendance_exceptions: {
        Row: {
          approval_comment: string | null
          approval_date: string | null
          approved_by: string | null
          created_at: string
          exception_date: string
          exception_type: string
          id: string
          original_check_in_time: string | null
          original_check_out_time: string | null
          reason: string
          requested_check_in_time: string | null
          requested_check_out_time: string | null
          staff_id: string
          status: string
          updated_at: string
        }
        Insert: {
          approval_comment?: string | null
          approval_date?: string | null
          approved_by?: string | null
          created_at?: string
          exception_date: string
          exception_type: string
          id?: string
          original_check_in_time?: string | null
          original_check_out_time?: string | null
          reason: string
          requested_check_in_time?: string | null
          requested_check_out_time?: string | null
          staff_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          approval_comment?: string | null
          approval_date?: string | null
          approved_by?: string | null
          created_at?: string
          exception_date?: string
          exception_type?: string
          id?: string
          original_check_in_time?: string | null
          original_check_out_time?: string | null
          reason?: string
          requested_check_in_time?: string | null
          requested_check_out_time?: string | null
          staff_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_exceptions_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_exceptions_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
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
          department_latitude: number | null
          department_longitude: number | null
          department_name: string | null
          distance: number | null
          gps_comparison_result: Json | null
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
          department_latitude?: number | null
          department_longitude?: number | null
          department_name?: string | null
          distance?: number | null
          gps_comparison_result?: Json | null
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
          department_latitude?: number | null
          department_longitude?: number | null
          department_name?: string | null
          distance?: number | null
          gps_comparison_result?: Json | null
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
      countries: {
        Row: {
          code: string
          created_at: string
          currency_code: string
          date_format: string
          id: string
          is_active: boolean
          name_en: string
          name_zh: string
          time_format: string
          timezone: string
          updated_at: string
          week_start: number
        }
        Insert: {
          code: string
          created_at?: string
          currency_code: string
          date_format?: string
          id?: string
          is_active?: boolean
          name_en: string
          name_zh: string
          time_format?: string
          timezone: string
          updated_at?: string
          week_start?: number
        }
        Update: {
          code?: string
          created_at?: string
          currency_code?: string
          date_format?: string
          id?: string
          is_active?: boolean
          name_en?: string
          name_zh?: string
          time_format?: string
          timezone?: string
          updated_at?: string
          week_start?: number
        }
        Relationships: []
      }
      departments: {
        Row: {
          address_verified: boolean | null
          check_in_radius: number | null
          created_at: string
          gps_status: string | null
          id: string
          latitude: number | null
          location: string | null
          longitude: number | null
          manager_contact: string | null
          manager_name: string | null
          name: string
          staff_count: number
          type: string
          updated_at: string
        }
        Insert: {
          address_verified?: boolean | null
          check_in_radius?: number | null
          created_at?: string
          gps_status?: string | null
          id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          manager_contact?: string | null
          manager_name?: string | null
          name: string
          staff_count?: number
          type: string
          updated_at?: string
        }
        Update: {
          address_verified?: boolean | null
          check_in_radius?: number | null
          created_at?: string
          gps_status?: string | null
          id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          manager_contact?: string | null
          manager_name?: string | null
          name?: string
          staff_count?: number
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      holidays: {
        Row: {
          branch_id: string | null
          country_id: string | null
          created_at: string
          holiday_date: string
          holiday_type: string
          id: string
          is_active: boolean
          is_recurring: boolean
          name_en: string
          name_zh: string
          recurring_rule: string | null
          updated_at: string
        }
        Insert: {
          branch_id?: string | null
          country_id?: string | null
          created_at?: string
          holiday_date: string
          holiday_type: string
          id?: string
          is_active?: boolean
          is_recurring?: boolean
          name_en: string
          name_zh: string
          recurring_rule?: string | null
          updated_at?: string
        }
        Update: {
          branch_id?: string | null
          country_id?: string | null
          created_at?: string
          holiday_date?: string
          holiday_type?: string
          id?: string
          is_active?: boolean
          is_recurring?: boolean
          name_en?: string
          name_zh?: string
          recurring_rule?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "holidays_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "holidays_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      i18n_labels: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          label_key: string
          label_value: string
          language_code: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          label_key: string
          label_value: string
          language_code: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          label_key?: string
          label_value?: string
          language_code?: string
          updated_at?: string
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
      leave_types: {
        Row: {
          annual_reset: boolean
          code: string
          created_at: string
          description: string | null
          gender_restriction: string | null
          id: string
          is_active: boolean
          is_paid: boolean
          is_system_default: boolean
          max_days_per_month: number | null
          max_days_per_year: number | null
          name_en: string
          name_zh: string
          requires_approval: boolean
          requires_attachment: boolean
          sort_order: number
          special_rules: Json | null
          updated_at: string
        }
        Insert: {
          annual_reset?: boolean
          code: string
          created_at?: string
          description?: string | null
          gender_restriction?: string | null
          id?: string
          is_active?: boolean
          is_paid?: boolean
          is_system_default?: boolean
          max_days_per_month?: number | null
          max_days_per_year?: number | null
          name_en: string
          name_zh: string
          requires_approval?: boolean
          requires_attachment?: boolean
          sort_order?: number
          special_rules?: Json | null
          updated_at?: string
        }
        Update: {
          annual_reset?: boolean
          code?: string
          created_at?: string
          description?: string | null
          gender_restriction?: string | null
          id?: string
          is_active?: boolean
          is_paid?: boolean
          is_system_default?: boolean
          max_days_per_month?: number | null
          max_days_per_year?: number | null
          name_en?: string
          name_zh?: string
          requires_approval?: boolean
          requires_attachment?: boolean
          sort_order?: number
          special_rules?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      missed_checkin_approval_records: {
        Row: {
          approval_date: string | null
          approver_id: string | null
          approver_name: string
          comment: string | null
          created_at: string
          id: string
          level: number
          missed_checkin_request_id: string
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
          level: number
          missed_checkin_request_id: string
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
          level?: number
          missed_checkin_request_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      missed_checkin_requests: {
        Row: {
          approval_comment: string | null
          approval_date: string | null
          approval_level: number | null
          approved_by: string | null
          approved_by_name: string | null
          created_at: string
          current_approver: string | null
          id: string
          missed_type: string
          reason: string
          rejection_reason: string | null
          request_date: string
          requested_check_in_time: string | null
          requested_check_out_time: string | null
          staff_id: string
          status: string
          updated_at: string
        }
        Insert: {
          approval_comment?: string | null
          approval_date?: string | null
          approval_level?: number | null
          approved_by?: string | null
          approved_by_name?: string | null
          created_at?: string
          current_approver?: string | null
          id?: string
          missed_type: string
          reason: string
          rejection_reason?: string | null
          request_date: string
          requested_check_in_time?: string | null
          requested_check_out_time?: string | null
          staff_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          approval_comment?: string | null
          approval_date?: string | null
          approval_level?: number | null
          approved_by?: string | null
          approved_by_name?: string | null
          created_at?: string
          current_approver?: string | null
          id?: string
          missed_type?: string
          reason?: string
          rejection_reason?: string | null
          request_date?: string
          requested_check_in_time?: string | null
          requested_check_out_time?: string | null
          staff_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_missed_checkin_requests_staff_id"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_required: boolean
          announcement_id: string | null
          created_at: string
          id: string
          is_read: boolean
          leave_request_id: string | null
          message: string
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action_required?: boolean
          announcement_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          leave_request_id?: string | null
          message: string
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action_required?: boolean
          announcement_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          leave_request_id?: string | null
          message?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_leave_request_id_fkey"
            columns: ["leave_request_id"]
            isOneToOne: false
            referencedRelation: "leave_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      overtime_approval_records: {
        Row: {
          approval_date: string | null
          approver_id: string | null
          approver_name: string
          comment: string | null
          created_at: string
          id: string
          level: number
          overtime_request_id: string
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
          level: number
          overtime_request_id: string
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
          level?: number
          overtime_request_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_overtime_approval_records_overtime_request_id"
            columns: ["overtime_request_id"]
            isOneToOne: false
            referencedRelation: "overtime_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      overtime_requests: {
        Row: {
          approval_level: number | null
          attachment_url: string | null
          created_at: string
          current_approver: string | null
          end_time: string
          hours: number
          id: string
          overtime_date: string
          overtime_type: string
          reason: string
          rejection_reason: string | null
          staff_id: string | null
          start_time: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          approval_level?: number | null
          attachment_url?: string | null
          created_at?: string
          current_approver?: string | null
          end_time: string
          hours: number
          id?: string
          overtime_date: string
          overtime_type: string
          reason: string
          rejection_reason?: string | null
          staff_id?: string | null
          start_time: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          approval_level?: number | null
          attachment_url?: string | null
          created_at?: string
          current_approver?: string | null
          end_time?: string
          hours?: number
          id?: string
          overtime_date?: string
          overtime_type?: string
          reason?: string
          rejection_reason?: string | null
          staff_id?: string | null
          start_time?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_overtime_requests_staff_id"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_overtime_requests_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      overtime_types: {
        Row: {
          code: string
          compensation_type: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          is_system_default: boolean
          max_hours_per_day: number | null
          max_hours_per_month: number | null
          name_en: string
          name_zh: string
          requires_approval: boolean
          requires_attachment: boolean
          sort_order: number
          special_rules: Json | null
          updated_at: string
        }
        Insert: {
          code: string
          compensation_type?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_system_default?: boolean
          max_hours_per_day?: number | null
          max_hours_per_month?: number | null
          name_en: string
          name_zh: string
          requires_approval?: boolean
          requires_attachment?: boolean
          sort_order?: number
          special_rules?: Json | null
          updated_at?: string
        }
        Update: {
          code?: string
          compensation_type?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_system_default?: boolean
          max_hours_per_day?: number | null
          max_hours_per_month?: number | null
          name_en?: string
          name_zh?: string
          requires_approval?: boolean
          requires_attachment?: boolean
          sort_order?: number
          special_rules?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      payroll_approvals: {
        Row: {
          action: string
          approver_id: string
          approver_name: string
          comment: string | null
          created_at: string
          id: string
          payroll_id: string
        }
        Insert: {
          action: string
          approver_id: string
          approver_name: string
          comment?: string | null
          created_at?: string
          id?: string
          payroll_id: string
        }
        Update: {
          action?: string
          approver_id?: string
          approver_name?: string
          comment?: string | null
          created_at?: string
          id?: string
          payroll_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payroll_approvals_approver_id_fkey"
            columns: ["approver_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_approvals_payroll_id_fkey"
            columns: ["payroll_id"]
            isOneToOne: false
            referencedRelation: "payrolls"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_payments: {
        Row: {
          amount: number
          comment: string | null
          created_at: string
          id: string
          paid_by: string
          paid_by_name: string
          payment_date: string
          payment_method: string
          payment_reference: string | null
          payroll_id: string
        }
        Insert: {
          amount: number
          comment?: string | null
          created_at?: string
          id?: string
          paid_by: string
          paid_by_name: string
          payment_date?: string
          payment_method?: string
          payment_reference?: string | null
          payroll_id: string
        }
        Update: {
          amount?: number
          comment?: string | null
          created_at?: string
          id?: string
          paid_by?: string
          paid_by_name?: string
          payment_date?: string
          payment_method?: string
          payment_reference?: string | null
          payroll_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payroll_payments_paid_by_fkey"
            columns: ["paid_by"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_payments_payroll_id_fkey"
            columns: ["payroll_id"]
            isOneToOne: false
            referencedRelation: "payrolls"
            referencedColumns: ["id"]
          },
        ]
      }
      payrolls: {
        Row: {
          allowances: number | null
          approval_comment: string | null
          approval_date: string | null
          approved_by: string | null
          base_salary: number
          calculated_at: string | null
          created_at: string
          deductions: number | null
          gross_salary: number
          health_insurance: number | null
          holiday_hours: number | null
          holiday_pay: number | null
          id: string
          labor_insurance: number | null
          net_salary: number
          overtime_hours: number | null
          overtime_pay: number | null
          paid_by: string | null
          paid_date: string | null
          pay_period_end: string
          pay_period_start: string
          payment_comment: string | null
          payment_method: string | null
          payment_reference: string | null
          salary_structure_id: string
          staff_id: string
          status: string
          tax: number | null
          updated_at: string
        }
        Insert: {
          allowances?: number | null
          approval_comment?: string | null
          approval_date?: string | null
          approved_by?: string | null
          base_salary: number
          calculated_at?: string | null
          created_at?: string
          deductions?: number | null
          gross_salary: number
          health_insurance?: number | null
          holiday_hours?: number | null
          holiday_pay?: number | null
          id?: string
          labor_insurance?: number | null
          net_salary: number
          overtime_hours?: number | null
          overtime_pay?: number | null
          paid_by?: string | null
          paid_date?: string | null
          pay_period_end: string
          pay_period_start: string
          payment_comment?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          salary_structure_id: string
          staff_id: string
          status?: string
          tax?: number | null
          updated_at?: string
        }
        Update: {
          allowances?: number | null
          approval_comment?: string | null
          approval_date?: string | null
          approved_by?: string | null
          base_salary?: number
          calculated_at?: string | null
          created_at?: string
          deductions?: number | null
          gross_salary?: number
          health_insurance?: number | null
          holiday_hours?: number | null
          holiday_pay?: number | null
          id?: string
          labor_insurance?: number | null
          net_salary?: number
          overtime_hours?: number | null
          overtime_pay?: number | null
          paid_by?: string | null
          paid_date?: string | null
          pay_period_end?: string
          pay_period_start?: string
          payment_comment?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          salary_structure_id?: string
          staff_id?: string
          status?: string
          tax?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payrolls_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payrolls_paid_by_fkey"
            columns: ["paid_by"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payrolls_salary_structure_id_fkey"
            columns: ["salary_structure_id"]
            isOneToOne: false
            referencedRelation: "salary_structures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payrolls_staff_id_fkey"
            columns: ["staff_id"]
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
      positions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          level: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          level?: number
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          level?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      reminder_settings: {
        Row: {
          branch_id: string | null
          created_at: string
          department: string | null
          id: string
          is_active: boolean
          message_template: string
          notification_method: string[]
          reminder_days: number[]
          reminder_time: string
          reminder_type: string
          staff_id: string | null
          trigger_condition: Json
          updated_at: string
        }
        Insert: {
          branch_id?: string | null
          created_at?: string
          department?: string | null
          id?: string
          is_active?: boolean
          message_template: string
          notification_method?: string[]
          reminder_days?: number[]
          reminder_time: string
          reminder_type: string
          staff_id?: string | null
          trigger_condition: Json
          updated_at?: string
        }
        Update: {
          branch_id?: string | null
          created_at?: string
          department?: string | null
          id?: string
          is_active?: boolean
          message_template?: string
          notification_method?: string[]
          reminder_days?: number[]
          reminder_time?: string
          reminder_type?: string
          staff_id?: string | null
          trigger_condition?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminder_settings_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminder_settings_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
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
      salary_structures: {
        Row: {
          allowances: Json | null
          base_salary: number
          benefits: Json | null
          created_at: string
          department: string
          effective_date: string
          holiday_rate: number
          id: string
          is_active: boolean
          level: number
          overtime_rate: number
          position: string
          updated_at: string
        }
        Insert: {
          allowances?: Json | null
          base_salary: number
          benefits?: Json | null
          created_at?: string
          department: string
          effective_date?: string
          holiday_rate?: number
          id?: string
          is_active?: boolean
          level?: number
          overtime_rate?: number
          position: string
          updated_at?: string
        }
        Update: {
          allowances?: Json | null
          base_salary?: number
          benefits?: Json | null
          created_at?: string
          department?: string
          effective_date?: string
          holiday_rate?: number
          id?: string
          is_active?: boolean
          level?: number
          overtime_rate?: number
          position?: string
          updated_at?: string
        }
        Relationships: []
      }
      schedules: {
        Row: {
          created_at: string
          created_by: string
          end_time: string
          id: string
          start_time: string
          time_slot: string
          time_slot_id: string | null
          updated_at: string
          user_id: string
          work_date: string
        }
        Insert: {
          created_at?: string
          created_by: string
          end_time: string
          id?: string
          start_time: string
          time_slot: string
          time_slot_id?: string | null
          updated_at?: string
          user_id: string
          work_date: string
        }
        Update: {
          created_at?: string
          created_by?: string
          end_time?: string
          id?: string
          start_time?: string
          time_slot?: string
          time_slot_id?: string | null
          updated_at?: string
          user_id?: string
          work_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedules_time_slot_id_fkey"
            columns: ["time_slot_id"]
            isOneToOne: false
            referencedRelation: "time_slots"
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
          hire_date: string | null
          id: string
          name: string
          password: string | null
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
          hire_date?: string | null
          id?: string
          name: string
          password?: string | null
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
          hire_date?: string | null
          id?: string
          name?: string
          password?: string | null
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
      system_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          setting_key: string
          setting_value: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key: string
          setting_value: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      time_slots: {
        Row: {
          created_at: string
          created_by: string
          end_time: string
          id: string
          is_active: boolean
          name: string
          requires_checkin: boolean
          sort_order: number
          start_time: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          end_time: string
          id?: string
          is_active?: boolean
          name: string
          requires_checkin?: boolean
          sort_order?: number
          start_time: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          end_time?: string
          id?: string
          is_active?: boolean
          name?: string
          requires_checkin?: boolean
          sort_order?: number
          start_time?: string
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
        Args: { hire_date: string } | { hire_date: string; target_year: number }
        Returns: number
      }
      create_notification: {
        Args: {
          p_user_id: string
          p_title: string
          p_message: string
          p_type?: string
          p_announcement_id?: string
          p_leave_request_id?: string
          p_action_required?: boolean
        }
        Returns: string
      }
      create_overtime_notification: {
        Args: {
          p_user_id: string
          p_title: string
          p_message: string
          p_type?: string
          p_overtime_request_id?: string
          p_action_required?: boolean
        }
        Returns: string
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
      get_current_user_role_safe: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_table_rls_status: {
        Args: { table_name: string }
        Returns: boolean
      }
      get_user_role_safe: {
        Args: { user_uuid: string }
        Returns: string
      }
      initialize_annual_leave_balance: {
        Args: { staff_uuid: string; target_year: number }
        Returns: undefined
      }
      initialize_or_update_annual_leave_balance: {
        Args: { staff_uuid: string; target_year?: number }
        Returns: undefined
      }
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      mark_announcement_as_read: {
        Args: { user_uuid: string; announcement_uuid: string }
        Returns: undefined
      }
      toggle_table_rls: {
        Args: { table_name: string; enabled: boolean }
        Returns: boolean
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
