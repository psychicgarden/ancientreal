export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      appreciation_events: {
        Row: {
          ancient_share: number
          appraised_value: number
          buyer_share: number
          capped_appreciation_value: number
          created_at: string
          event_date: string
          id: string
          lender_share: number
          original_price: number
          property_id: string
          status: string
        }
        Insert: {
          ancient_share: number
          appraised_value: number
          buyer_share: number
          capped_appreciation_value: number
          created_at?: string
          event_date?: string
          id?: string
          lender_share: number
          original_price: number
          property_id: string
          status?: string
        }
        Update: {
          ancient_share?: number
          appraised_value?: number
          buyer_share?: number
          capped_appreciation_value?: number
          created_at?: string
          event_date?: string
          id?: string
          lender_share?: number
          original_price?: number
          property_id?: string
          status?: string
        }
        Relationships: []
      }
      developer_investments: {
        Row: {
          created_at: string
          id: string
          investment_amount: number
          investment_status: string
          net_investment: number
          ownership_percentage: number
          platform_fee: number
          project_id: string
          projected_profit: number
          projected_value: number
          transaction_hash: string | null
          updated_at: string
          user_wallet_address: string
        }
        Insert: {
          created_at?: string
          id?: string
          investment_amount: number
          investment_status?: string
          net_investment: number
          ownership_percentage: number
          platform_fee?: number
          project_id: string
          projected_profit: number
          projected_value: number
          transaction_hash?: string | null
          updated_at?: string
          user_wallet_address: string
        }
        Update: {
          created_at?: string
          id?: string
          investment_amount?: number
          investment_status?: string
          net_investment?: number
          ownership_percentage?: number
          platform_fee?: number
          project_id?: string
          projected_profit?: number
          projected_value?: number
          transaction_hash?: string | null
          updated_at?: string
          user_wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "developer_investments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "developer_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      developer_project_updates: {
        Row: {
          created_at: string
          id: string
          milestone_percentage: number | null
          project_id: string
          update_content: string
          update_title: string
          update_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          milestone_percentage?: number | null
          project_id: string
          update_content: string
          update_title: string
          update_type?: string
        }
        Update: {
          created_at?: string
          id?: string
          milestone_percentage?: number | null
          project_id?: string
          update_content?: string
          update_title?: string
          update_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "developer_project_updates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "developer_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      developer_projects: {
        Row: {
          category: string | null
          created_at: string
          creator_name: string
          creator_wallet_address: string
          current_funding: number
          description: string | null
          estimated_yield: number
          funding_deadline: string | null
          id: string
          image_url: string | null
          max_investment: number | null
          min_investment: number
          presale_price: number
          project_status: string
          target_funding: number
          timeline: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          creator_name: string
          creator_wallet_address: string
          current_funding?: number
          description?: string | null
          estimated_yield?: number
          funding_deadline?: string | null
          id?: string
          image_url?: string | null
          max_investment?: number | null
          min_investment?: number
          presale_price: number
          project_status?: string
          target_funding: number
          timeline?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          creator_name?: string
          creator_wallet_address?: string
          current_funding?: number
          description?: string | null
          estimated_yield?: number
          funding_deadline?: string | null
          id?: string
          image_url?: string | null
          max_investment?: number | null
          min_investment?: number
          presale_price?: number
          project_status?: string
          target_funding?: number
          timeline?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      fractional_investments: {
        Row: {
          created_at: string
          id: string
          investment_amount: number
          investment_date: string
          investor_wallet_address: string
          original_property_price: number
          ownership_percentage: number
          property_id: string
          speculation_price: number | null
          status: string
          token_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          investment_amount: number
          investment_date?: string
          investor_wallet_address: string
          original_property_price: number
          ownership_percentage: number
          property_id: string
          speculation_price?: number | null
          status?: string
          token_amount: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          investment_amount?: number
          investment_date?: string
          investor_wallet_address?: string
          original_property_price?: number
          ownership_percentage?: number
          property_id?: string
          speculation_price?: number | null
          status?: string
          token_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      payment_history: {
        Row: {
          created_at: string
          id: string
          payment_amount: number
          payment_date: string
          payment_type: string
          property_id: string | null
          remaining_balance_after: number
          status: string
          transaction_hash: string | null
          updated_at: string
          user_wallet_address: string
        }
        Insert: {
          created_at?: string
          id?: string
          payment_amount: number
          payment_date?: string
          payment_type?: string
          property_id?: string | null
          remaining_balance_after: number
          status?: string
          transaction_hash?: string | null
          updated_at?: string
          user_wallet_address: string
        }
        Update: {
          created_at?: string
          id?: string
          payment_amount?: number
          payment_date?: string
          payment_type?: string
          property_id?: string | null
          remaining_balance_after?: number
          status?: string
          transaction_hash?: string | null
          updated_at?: string
          user_wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_history_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "user_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      project_submissions: {
        Row: {
          business_plan: Json | null
          compliance_status: string | null
          created_at: string
          creator_email: string
          creator_name: string
          creator_wallet_address: string
          demo_url: string | null
          estimated_yield: number
          funding_deadline: string | null
          github_repo_url: string | null
          id: string
          legal_docs: Json | null
          market_analysis: string | null
          max_investment: number | null
          min_investment: number
          project_category: string
          project_description: string
          project_title: string
          revenue_model: string | null
          review_notes: string | null
          submission_status: string
          target_funding: number
          team_info: Json | null
          technical_docs: Json | null
          timeline: string | null
          updated_at: string
          uploaded_documents: Json | null
        }
        Insert: {
          business_plan?: Json | null
          compliance_status?: string | null
          created_at?: string
          creator_email: string
          creator_name: string
          creator_wallet_address: string
          demo_url?: string | null
          estimated_yield?: number
          funding_deadline?: string | null
          github_repo_url?: string | null
          id?: string
          legal_docs?: Json | null
          market_analysis?: string | null
          max_investment?: number | null
          min_investment?: number
          project_category?: string
          project_description: string
          project_title: string
          revenue_model?: string | null
          review_notes?: string | null
          submission_status?: string
          target_funding: number
          team_info?: Json | null
          technical_docs?: Json | null
          timeline?: string | null
          updated_at?: string
          uploaded_documents?: Json | null
        }
        Update: {
          business_plan?: Json | null
          compliance_status?: string | null
          created_at?: string
          creator_email?: string
          creator_name?: string
          creator_wallet_address?: string
          demo_url?: string | null
          estimated_yield?: number
          funding_deadline?: string | null
          github_repo_url?: string | null
          id?: string
          legal_docs?: Json | null
          market_analysis?: string | null
          max_investment?: number | null
          min_investment?: number
          project_category?: string
          project_description?: string
          project_title?: string
          revenue_model?: string | null
          review_notes?: string | null
          submission_status?: string
          target_funding?: number
          team_info?: Json | null
          technical_docs?: Json | null
          timeline?: string | null
          updated_at?: string
          uploaded_documents?: Json | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          created_at: string
          id: number
          name: string
          price: number
        }
        Insert: {
          address: string
          created_at?: string
          id?: number
          name: string
          price: number
        }
        Update: {
          address?: string
          created_at?: string
          id?: number
          name?: string
          price?: number
        }
        Relationships: []
      }
      property_fractionalization: {
        Row: {
          created_at: string
          current_speculation_price: number
          id: string
          is_active: boolean
          min_investment: number
          original_purchase_price: number
          owner_wallet_address: string
          property_id: string
          tokens_sold: number
          total_tokens_available: number
          updated_at: string
          year_10_trigger_date: string
        }
        Insert: {
          created_at?: string
          current_speculation_price: number
          id?: string
          is_active?: boolean
          min_investment?: number
          original_purchase_price: number
          owner_wallet_address: string
          property_id: string
          tokens_sold?: number
          total_tokens_available?: number
          updated_at?: string
          year_10_trigger_date: string
        }
        Update: {
          created_at?: string
          current_speculation_price?: number
          id?: string
          is_active?: boolean
          min_investment?: number
          original_purchase_price?: number
          owner_wallet_address?: string
          property_id?: string
          tokens_sold?: number
          total_tokens_available?: number
          updated_at?: string
          year_10_trigger_date?: string
        }
        Relationships: []
      }
      staking_transactions: {
        Row: {
          amount: number
          block_number: number | null
          created_at: string
          gas_price: number | null
          gas_used: number | null
          id: string
          metadata: Json | null
          status: string
          transaction_hash: string | null
          transaction_type: string
          updated_at: string
          user_wallet_address: string
        }
        Insert: {
          amount: number
          block_number?: number | null
          created_at?: string
          gas_price?: number | null
          gas_used?: number | null
          id?: string
          metadata?: Json | null
          status?: string
          transaction_hash?: string | null
          transaction_type: string
          updated_at?: string
          user_wallet_address: string
        }
        Update: {
          amount?: number
          block_number?: number | null
          created_at?: string
          gas_price?: number | null
          gas_used?: number | null
          id?: string
          metadata?: Json | null
          status?: string
          transaction_hash?: string | null
          transaction_type?: string
          updated_at?: string
          user_wallet_address?: string
        }
        Relationships: []
      }
      user_properties: {
        Row: {
          created_at: string
          current_value: number
          down_payment: number
          equity_percentage: number
          id: string
          image_url: string | null
          is_active: boolean
          monthly_payment: number
          mortgage_id: string | null
          property_location: string
          property_name: string
          purchase_date: string
          purchase_price: number
          remaining_balance: number
          updated_at: string
          user_wallet_address: string
        }
        Insert: {
          created_at?: string
          current_value?: number
          down_payment: number
          equity_percentage?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          monthly_payment?: number
          mortgage_id?: string | null
          property_location: string
          property_name: string
          purchase_date?: string
          purchase_price: number
          remaining_balance?: number
          updated_at?: string
          user_wallet_address: string
        }
        Update: {
          created_at?: string
          current_value?: number
          down_payment?: number
          equity_percentage?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          monthly_payment?: number
          mortgage_id?: string | null
          property_location?: string
          property_name?: string
          purchase_date?: string
          purchase_price?: number
          remaining_balance?: number
          updated_at?: string
          user_wallet_address?: string
        }
        Relationships: []
      }
      user_staking: {
        Row: {
          created_at: string
          current_apy: number
          id: string
          is_active: boolean
          last_yield_calculation: string
          total_earned: number
          total_staked: number
          updated_at: string
          user_wallet_address: string
        }
        Insert: {
          created_at?: string
          current_apy?: number
          id?: string
          is_active?: boolean
          last_yield_calculation?: string
          total_earned?: number
          total_staked?: number
          updated_at?: string
          user_wallet_address: string
        }
        Update: {
          created_at?: string
          current_apy?: number
          id?: string
          is_active?: boolean
          last_yield_calculation?: string
          total_earned?: number
          total_staked?: number
          updated_at?: string
          user_wallet_address?: string
        }
        Relationships: []
      }
      user_transactions: {
        Row: {
          amount: number
          block_number: number | null
          created_at: string
          currency: string
          gas_price: number | null
          gas_used: number | null
          id: string
          metadata: Json | null
          status: string
          transaction_hash: string
          transaction_type: string
          updated_at: string
          user_wallet_address: string
        }
        Insert: {
          amount: number
          block_number?: number | null
          created_at?: string
          currency?: string
          gas_price?: number | null
          gas_used?: number | null
          id?: string
          metadata?: Json | null
          status?: string
          transaction_hash: string
          transaction_type: string
          updated_at?: string
          user_wallet_address: string
        }
        Update: {
          amount?: number
          block_number?: number | null
          created_at?: string
          currency?: string
          gas_price?: number | null
          gas_used?: number | null
          id?: string
          metadata?: Json | null
          status?: string
          transaction_hash?: string
          transaction_type?: string
          updated_at?: string
          user_wallet_address?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_appreciation_distribution: {
        Args: { original_price: number; appraised_value: number }
        Returns: {
          capped_appreciation: number
          ancient_share: number
          lender_share: number
          buyer_share: number
        }[]
      }
      calculate_daily_yield: {
        Args: Record<PropertyKey, never>
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
