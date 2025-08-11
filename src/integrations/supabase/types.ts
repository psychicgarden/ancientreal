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
      investor_rental_claims: {
        Row: {
          claimable_amount: number
          claimed_amount: number
          claimed_at: string | null
          created_at: string
          distribution_id: string
          id: string
          investor_wallet_address: string
          ownership_percentage: number
          property_fractionalization_id: string
          updated_at: string
        }
        Insert: {
          claimable_amount?: number
          claimed_amount?: number
          claimed_at?: string | null
          created_at?: string
          distribution_id: string
          id?: string
          investor_wallet_address: string
          ownership_percentage?: number
          property_fractionalization_id: string
          updated_at?: string
        }
        Update: {
          claimable_amount?: number
          claimed_amount?: number
          claimed_at?: string | null
          created_at?: string
          distribution_id?: string
          id?: string
          investor_wallet_address?: string
          ownership_percentage?: number
          property_fractionalization_id?: string
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
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          wallet_address: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
          wallet_address?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          wallet_address?: string | null
        }
        Relationships: []
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
          appreciation_cap_percent: number | null
          created_at: string
          current_speculation_price: number
          id: string
          investor_appreciation_burden_percent: number | null
          is_active: boolean
          last_rental_distribution: string | null
          min_investment: number
          monthly_base_rent: number | null
          original_property_value: number | null
          original_purchase_price: number
          owner_wallet_address: string
          projected_appreciation_percent: number | null
          property_expenses_ytd: number | null
          property_id: string
          tokens_sold: number
          total_rental_collected: number | null
          total_tokens_available: number
          updated_at: string
          year_10_trigger_date: string
        }
        Insert: {
          appreciation_cap_percent?: number | null
          created_at?: string
          current_speculation_price: number
          id?: string
          investor_appreciation_burden_percent?: number | null
          is_active?: boolean
          last_rental_distribution?: string | null
          min_investment?: number
          monthly_base_rent?: number | null
          original_property_value?: number | null
          original_purchase_price: number
          owner_wallet_address: string
          projected_appreciation_percent?: number | null
          property_expenses_ytd?: number | null
          property_id: string
          tokens_sold?: number
          total_rental_collected?: number | null
          total_tokens_available?: number
          updated_at?: string
          year_10_trigger_date: string
        }
        Update: {
          appreciation_cap_percent?: number | null
          created_at?: string
          current_speculation_price?: number
          id?: string
          investor_appreciation_burden_percent?: number | null
          is_active?: boolean
          last_rental_distribution?: string | null
          min_investment?: number
          monthly_base_rent?: number | null
          original_property_value?: number | null
          original_purchase_price?: number
          owner_wallet_address?: string
          projected_appreciation_percent?: number | null
          property_expenses_ytd?: number | null
          property_id?: string
          tokens_sold?: number
          total_rental_collected?: number | null
          total_tokens_available?: number
          updated_at?: string
          year_10_trigger_date?: string
        }
        Relationships: []
      }
      rental_income_distributions: {
        Row: {
          created_at: string
          distributable_amount: number
          distribution_date: string
          expense_breakdown: Json | null
          id: string
          management_fee_amount: number
          management_fee_percent: number
          net_rental_income: number
          property_expenses: number
          property_fractionalization_id: string
          total_rental_income: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          distributable_amount?: number
          distribution_date: string
          expense_breakdown?: Json | null
          id?: string
          management_fee_amount?: number
          management_fee_percent?: number
          net_rental_income?: number
          property_expenses?: number
          property_fractionalization_id: string
          total_rental_income?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          distributable_amount?: number
          distribution_date?: string
          expense_breakdown?: Json | null
          id?: string
          management_fee_amount?: number
          management_fee_percent?: number
          net_rental_income?: number
          property_expenses?: number
          property_fractionalization_id?: string
          total_rental_income?: number
          updated_at?: string
        }
        Relationships: []
      }
      secondary_orders: {
        Row: {
          created_at: string
          expiry: string | null
          id: string
          order_type: string
          owner_wallet_address: string
          price_per_token: number
          property_fractionalization_id: string
          status: string
          token_amount: number
          tokens_filled: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          expiry?: string | null
          id?: string
          order_type: string
          owner_wallet_address: string
          price_per_token: number
          property_fractionalization_id: string
          status?: string
          token_amount: number
          tokens_filled?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          expiry?: string | null
          id?: string
          order_type?: string
          owner_wallet_address?: string
          price_per_token?: number
          property_fractionalization_id?: string
          status?: string
          token_amount?: number
          tokens_filled?: number
          updated_at?: string
        }
        Relationships: []
      }
      secondary_trades: {
        Row: {
          buyer_wallet_address: string
          created_at: string
          id: string
          order_id: string
          price_per_token: number
          property_fractionalization_id: string
          seller_wallet_address: string
          status: string
          token_amount: number
          total_cost: number
          transaction_hash: string | null
          updated_at: string
        }
        Insert: {
          buyer_wallet_address: string
          created_at?: string
          id?: string
          order_id: string
          price_per_token: number
          property_fractionalization_id: string
          seller_wallet_address: string
          status?: string
          token_amount: number
          total_cost: number
          transaction_hash?: string | null
          updated_at?: string
        }
        Update: {
          buyer_wallet_address?: string
          created_at?: string
          id?: string
          order_id?: string
          price_per_token?: number
          property_fractionalization_id?: string
          seller_wallet_address?: string
          status?: string
          token_amount?: number
          total_cost?: number
          transaction_hash?: string | null
          updated_at?: string
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
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
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
      distribute_monthly_rental_income: {
        Args: { property_frac_id: string; rental_month?: string }
        Returns: undefined
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      process_secondary_order_fill: {
        Args: {
          _order_id: string
          _buyer_wallet_address: string
          _fill_amount: number
          _price_per_token: number
          _tx_hash?: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
