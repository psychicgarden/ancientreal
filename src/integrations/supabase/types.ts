export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      app_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
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
      collateral_loans: {
        Row: {
          borrowed_at: string
          collateral_equity_base: number
          created_at: string
          due_date: string | null
          id: string
          interest_rate_bps: number
          last_payment_date: string | null
          loan_amount_base: number
          loan_to_value_percent: number
          property_id: number
          status: string
          total_interest_paid_base: number
          updated_at: string
          user_wallet_address: string
        }
        Insert: {
          borrowed_at?: string
          collateral_equity_base: number
          created_at?: string
          due_date?: string | null
          id?: string
          interest_rate_bps?: number
          last_payment_date?: string | null
          loan_amount_base: number
          loan_to_value_percent: number
          property_id: number
          status?: string
          total_interest_paid_base?: number
          updated_at?: string
          user_wallet_address: string
        }
        Update: {
          borrowed_at?: string
          collateral_equity_base?: number
          created_at?: string
          due_date?: string | null
          id?: string
          interest_rate_bps?: number
          last_payment_date?: string | null
          loan_amount_base?: number
          loan_to_value_percent?: number
          property_id?: number
          status?: string
          total_interest_paid_base?: number
          updated_at?: string
          user_wallet_address?: string
        }
        Relationships: []
      }
      contract_addresses: {
        Row: {
          abi_json: Json | null
          address: string
          contract_name: string
          created_at: string
          deployed_at: string
          deployer_address: string | null
          deployment_status: string
          deployment_tx_hash: string | null
          gas_used: number | null
          id: string
          network: string
          updated_at: string
        }
        Insert: {
          abi_json?: Json | null
          address: string
          contract_name: string
          created_at?: string
          deployed_at?: string
          deployer_address?: string | null
          deployment_status?: string
          deployment_tx_hash?: string | null
          gas_used?: number | null
          id?: string
          network?: string
          updated_at?: string
        }
        Update: {
          abi_json?: Json | null
          address?: string
          contract_name?: string
          created_at?: string
          deployed_at?: string
          deployer_address?: string | null
          deployment_status?: string
          deployment_tx_hash?: string | null
          gas_used?: number | null
          id?: string
          network?: string
          updated_at?: string
        }
        Relationships: []
      }
      contract_event_cursors: {
        Row: {
          contract_address: string
          created_at: string | null
          event_name: string
          id: string
          last_block_scanned: number
          network: string
          updated_at: string | null
        }
        Insert: {
          contract_address: string
          created_at?: string | null
          event_name: string
          id?: string
          last_block_scanned?: number
          network?: string
          updated_at?: string | null
        }
        Update: {
          contract_address?: string
          created_at?: string | null
          event_name?: string
          id?: string
          last_block_scanned?: number
          network?: string
          updated_at?: string | null
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
        Relationships: [
          {
            foreignKeyName: "fk_fractional_investments_property_id"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_fractionalization"
            referencedColumns: ["id"]
          },
        ]
      }
      fractional_investments_archive: {
        Row: {
          archived_at: string
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
          archived_at?: string
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
          archived_at?: string
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
      investor_rental_claims_archive: {
        Row: {
          archived_at: string
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
          archived_at?: string
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
          archived_at?: string
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
      mortgage_payments_ledger: {
        Row: {
          created_at: string
          id: number
          interest_delta_base: number
          principal_delta_base: number
          property_id: number
          tx_hash: string | null
          user_address: string
        }
        Insert: {
          created_at?: string
          id?: number
          interest_delta_base?: number
          principal_delta_base?: number
          property_id: number
          tx_hash?: string | null
          user_address: string
        }
        Update: {
          created_at?: string
          id?: number
          interest_delta_base?: number
          principal_delta_base?: number
          property_id?: number
          tx_hash?: string | null
          user_address?: string
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
            referencedRelation: "app_user_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_history_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "user_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_backups: {
        Row: {
          backup_data: Json
          backup_name: string
          backup_type: string | null
          created_at: string | null
          id: string
          notes: string | null
        }
        Insert: {
          backup_data: Json
          backup_name: string
          backup_type?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
        }
        Update: {
          backup_data?: Json
          backup_name?: string
          backup_type?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
        }
        Relationships: []
      }
      platform_fees: {
        Row: {
          created_at: string
          fee_amount_base: number
          fee_amount_usd: number
          fee_percentage: number
          id: string
          payment_status: string
          property_id: string | null
          property_value_usd: number
          transaction_hash: string | null
          updated_at: string
          user_wallet_address: string
        }
        Insert: {
          created_at?: string
          fee_amount_base: number
          fee_amount_usd: number
          fee_percentage?: number
          id?: string
          payment_status?: string
          property_id?: string | null
          property_value_usd: number
          transaction_hash?: string | null
          updated_at?: string
          user_wallet_address: string
        }
        Update: {
          created_at?: string
          fee_amount_base?: number
          fee_amount_usd?: number
          fee_percentage?: number
          id?: string
          payment_status?: string
          property_id?: string | null
          property_value_usd?: number
          transaction_hash?: string | null
          updated_at?: string
          user_wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_fees_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_fractionalization"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_fees_archive: {
        Row: {
          archived_at: string | null
          created_at: string
          fee_amount_base: number
          fee_amount_usd: number
          fee_percentage: number
          id: string
          payment_status: string
          property_id: string | null
          property_value_usd: number
          transaction_hash: string | null
          updated_at: string
          user_wallet_address: string
        }
        Insert: {
          archived_at?: string | null
          created_at?: string
          fee_amount_base: number
          fee_amount_usd: number
          fee_percentage?: number
          id?: string
          payment_status?: string
          property_id?: string | null
          property_value_usd: number
          transaction_hash?: string | null
          updated_at?: string
          user_wallet_address: string
        }
        Update: {
          archived_at?: string | null
          created_at?: string
          fee_amount_base?: number
          fee_amount_usd?: number
          fee_percentage?: number
          id?: string
          payment_status?: string
          property_id?: string | null
          property_value_usd?: number
          transaction_hash?: string | null
          updated_at?: string
          user_wallet_address?: string
        }
        Relationships: []
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
          bathrooms: number | null
          bedrooms: number | null
          created_at: string
          current_speculation_price: number
          down_payment_per_person: number | null
          group_size_limit: number | null
          id: string
          investment_type: string | null
          investor_appreciation_burden_percent: number | null
          is_active: boolean
          is_listed_fractionally: boolean | null
          last_rental_distribution: string | null
          listing_date: string | null
          min_investment: number
          monthly_base_rent: number | null
          mortgage_apr_bps: number | null
          mortgage_down_payment_total: number | null
          mortgage_term_months: number | null
          original_property_value: number | null
          original_purchase_price: number
          owner_approved_listing: boolean | null
          owner_listing_date: string | null
          owner_set_valuation: boolean | null
          owner_wallet_address: string
          projected_appreciation_percent: number | null
          property_description: string | null
          property_expenses_ytd: number | null
          property_id: string
          property_image_url: string | null
          property_image_url_backup: string | null
          property_location: string | null
          property_name: string | null
          property_type: string | null
          source_property_id: string | null
          square_feet: number | null
          tokens_sold: number
          total_rental_collected: number | null
          total_tokens_available: number
          updated_at: string
          year_10_trigger_date: string
        }
        Insert: {
          appreciation_cap_percent?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string
          current_speculation_price: number
          down_payment_per_person?: number | null
          group_size_limit?: number | null
          id?: string
          investment_type?: string | null
          investor_appreciation_burden_percent?: number | null
          is_active?: boolean
          is_listed_fractionally?: boolean | null
          last_rental_distribution?: string | null
          listing_date?: string | null
          min_investment?: number
          monthly_base_rent?: number | null
          mortgage_apr_bps?: number | null
          mortgage_down_payment_total?: number | null
          mortgage_term_months?: number | null
          original_property_value?: number | null
          original_purchase_price: number
          owner_approved_listing?: boolean | null
          owner_listing_date?: string | null
          owner_set_valuation?: boolean | null
          owner_wallet_address: string
          projected_appreciation_percent?: number | null
          property_description?: string | null
          property_expenses_ytd?: number | null
          property_id: string
          property_image_url?: string | null
          property_image_url_backup?: string | null
          property_location?: string | null
          property_name?: string | null
          property_type?: string | null
          source_property_id?: string | null
          square_feet?: number | null
          tokens_sold?: number
          total_rental_collected?: number | null
          total_tokens_available?: number
          updated_at?: string
          year_10_trigger_date: string
        }
        Update: {
          appreciation_cap_percent?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string
          current_speculation_price?: number
          down_payment_per_person?: number | null
          group_size_limit?: number | null
          id?: string
          investment_type?: string | null
          investor_appreciation_burden_percent?: number | null
          is_active?: boolean
          is_listed_fractionally?: boolean | null
          last_rental_distribution?: string | null
          listing_date?: string | null
          min_investment?: number
          monthly_base_rent?: number | null
          mortgage_apr_bps?: number | null
          mortgage_down_payment_total?: number | null
          mortgage_term_months?: number | null
          original_property_value?: number | null
          original_purchase_price?: number
          owner_approved_listing?: boolean | null
          owner_listing_date?: string | null
          owner_set_valuation?: boolean | null
          owner_wallet_address?: string
          projected_appreciation_percent?: number | null
          property_description?: string | null
          property_expenses_ytd?: number | null
          property_id?: string
          property_image_url?: string | null
          property_image_url_backup?: string | null
          property_location?: string | null
          property_name?: string | null
          property_type?: string | null
          source_property_id?: string | null
          square_feet?: number | null
          tokens_sold?: number
          total_rental_collected?: number | null
          total_tokens_available?: number
          updated_at?: string
          year_10_trigger_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_fractionalization_source_property_id_fkey"
            columns: ["source_property_id"]
            isOneToOne: false
            referencedRelation: "app_user_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_fractionalization_source_property_id_fkey"
            columns: ["source_property_id"]
            isOneToOne: false
            referencedRelation: "user_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      rental_income_distributions: {
        Row: {
          airbnb_metrics: Json | null
          booking_details: Json | null
          created_at: string
          distributable_amount: number
          distribution_date: string
          expense_breakdown: Json | null
          id: string
          income_source_breakdown: Json | null
          management_fee_amount: number
          management_fee_percent: number
          net_rental_income: number
          property_expenses: number
          property_fractionalization_id: string
          total_rental_income: number
          updated_at: string
        }
        Insert: {
          airbnb_metrics?: Json | null
          booking_details?: Json | null
          created_at?: string
          distributable_amount?: number
          distribution_date: string
          expense_breakdown?: Json | null
          id?: string
          income_source_breakdown?: Json | null
          management_fee_amount?: number
          management_fee_percent?: number
          net_rental_income?: number
          property_expenses?: number
          property_fractionalization_id: string
          total_rental_income?: number
          updated_at?: string
        }
        Update: {
          airbnb_metrics?: Json | null
          booking_details?: Json | null
          created_at?: string
          distributable_amount?: number
          distribution_date?: string
          expense_breakdown?: Json | null
          id?: string
          income_source_breakdown?: Json | null
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
      secondary_orders_archive: {
        Row: {
          archived_at: string
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
          archived_at?: string
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
          archived_at?: string
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
      secondary_trades_archive: {
        Row: {
          archived_at: string
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
          archived_at?: string
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
          archived_at?: string
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
          apr_bps: number | null
          created_at: string
          currency: string
          current_value: number
          down_payment: number
          down_payment_base: number | null
          equity_percentage: number
          id: string
          image_url: string | null
          interest_paid_base: number
          is_active: boolean
          loan_amount_base: number | null
          monthly_payment: number
          mortgage_id: string | null
          principal_paid_base: number
          property_id: number | null
          property_location: string
          property_name: string
          purchase_date: string
          purchase_price: number
          purchase_price_base: number | null
          remaining_balance: number
          remaining_balance_base: number | null
          term_months: number | null
          unique_purchase_key: string | null
          updated_at: string
          user_address: string | null
          user_wallet_address: string
        }
        Insert: {
          apr_bps?: number | null
          created_at?: string
          currency?: string
          current_value?: number
          down_payment: number
          down_payment_base?: number | null
          equity_percentage?: number
          id?: string
          image_url?: string | null
          interest_paid_base?: number
          is_active?: boolean
          loan_amount_base?: number | null
          monthly_payment?: number
          mortgage_id?: string | null
          principal_paid_base?: number
          property_id?: number | null
          property_location: string
          property_name: string
          purchase_date?: string
          purchase_price: number
          purchase_price_base?: number | null
          remaining_balance?: number
          remaining_balance_base?: number | null
          term_months?: number | null
          unique_purchase_key?: string | null
          updated_at?: string
          user_address?: string | null
          user_wallet_address: string
        }
        Update: {
          apr_bps?: number | null
          created_at?: string
          currency?: string
          current_value?: number
          down_payment?: number
          down_payment_base?: number | null
          equity_percentage?: number
          id?: string
          image_url?: string | null
          interest_paid_base?: number
          is_active?: boolean
          loan_amount_base?: number | null
          monthly_payment?: number
          mortgage_id?: string | null
          principal_paid_base?: number
          property_id?: number | null
          property_location?: string
          property_name?: string
          purchase_date?: string
          purchase_price?: number
          purchase_price_base?: number | null
          remaining_balance?: number
          remaining_balance_base?: number | null
          term_months?: number | null
          unique_purchase_key?: string | null
          updated_at?: string
          user_address?: string | null
          user_wallet_address?: string
        }
        Relationships: []
      }
      user_properties_archive: {
        Row: {
          apr_bps: number | null
          archived_at: string | null
          created_at: string
          currency: string
          current_value: number
          down_payment: number
          down_payment_base: number | null
          equity_percentage: number
          id: string
          image_url: string | null
          interest_paid_base: number
          is_active: boolean
          loan_amount_base: number | null
          monthly_payment: number
          mortgage_id: string | null
          principal_paid_base: number
          property_id: number | null
          property_location: string
          property_name: string
          purchase_date: string
          purchase_price: number
          purchase_price_base: number | null
          remaining_balance: number
          remaining_balance_base: number | null
          term_months: number | null
          unique_purchase_key: string | null
          updated_at: string
          user_address: string | null
          user_wallet_address: string
        }
        Insert: {
          apr_bps?: number | null
          archived_at?: string | null
          created_at?: string
          currency?: string
          current_value?: number
          down_payment: number
          down_payment_base?: number | null
          equity_percentage?: number
          id?: string
          image_url?: string | null
          interest_paid_base?: number
          is_active?: boolean
          loan_amount_base?: number | null
          monthly_payment?: number
          mortgage_id?: string | null
          principal_paid_base?: number
          property_id?: number | null
          property_location: string
          property_name: string
          purchase_date?: string
          purchase_price: number
          purchase_price_base?: number | null
          remaining_balance?: number
          remaining_balance_base?: number | null
          term_months?: number | null
          unique_purchase_key?: string | null
          updated_at?: string
          user_address?: string | null
          user_wallet_address: string
        }
        Update: {
          apr_bps?: number | null
          archived_at?: string | null
          created_at?: string
          currency?: string
          current_value?: number
          down_payment?: number
          down_payment_base?: number | null
          equity_percentage?: number
          id?: string
          image_url?: string | null
          interest_paid_base?: number
          is_active?: boolean
          loan_amount_base?: number | null
          monthly_payment?: number
          mortgage_id?: string | null
          principal_paid_base?: number
          property_id?: number | null
          property_location?: string
          property_name?: string
          purchase_date?: string
          purchase_price?: number
          purchase_price_base?: number | null
          remaining_balance?: number
          remaining_balance_base?: number | null
          term_months?: number | null
          unique_purchase_key?: string | null
          updated_at?: string
          user_address?: string | null
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
      user_transactions_archive: {
        Row: {
          amount: number
          archived_at: string | null
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
          archived_at?: string | null
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
          archived_at?: string | null
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
      app_user_properties: {
        Row: {
          down_payment: number | null
          down_payment_base: number | null
          id: string | null
          image_url: string | null
          interest_paid_base: number | null
          principal_paid_base: number | null
          property_id: number | null
          property_name: string | null
          purchase_price: number | null
          purchase_price_base: number | null
          remaining_balance: number | null
          remaining_balance_base: number | null
          updated_at: string | null
          user_address: string | null
        }
        Insert: {
          down_payment?: number | null
          down_payment_base?: number | null
          id?: string | null
          image_url?: string | null
          interest_paid_base?: number | null
          principal_paid_base?: number | null
          property_id?: number | null
          property_name?: string | null
          purchase_price?: number | null
          purchase_price_base?: number | null
          remaining_balance?: number | null
          remaining_balance_base?: number | null
          updated_at?: string | null
          user_address?: never
        }
        Update: {
          down_payment?: number | null
          down_payment_base?: number | null
          id?: string | null
          image_url?: string | null
          interest_paid_base?: number | null
          principal_paid_base?: number | null
          property_id?: number | null
          property_name?: string | null
          purchase_price?: number | null
          purchase_price_base?: number | null
          remaining_balance?: number | null
          remaining_balance_base?: number | null
          updated_at?: string | null
          user_address?: never
        }
        Relationships: []
      }
    }
    Functions: {
      apply_mortgage_payment: {
        Args: {
          p_interest_delta_base: number
          p_principal_delta_base: number
          p_property_id: number
          p_tx_hash?: string
          p_user_address: string
        }
        Returns: Json
      }
      backfill_user_properties_from_transactions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      backfill_user_property_from_tx: {
        Args: { _tx_id: string }
        Returns: undefined
      }
      calculate_appreciation_distribution: {
        Args: { appraised_value: number; original_price: number }
        Returns: {
          ancient_share: number
          buyer_share: number
          capped_appreciation: number
          lender_share: number
        }[]
      }
      calculate_daily_yield: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      calculate_monthly_payment: {
        Args: { apr_bps: number; loan_amount_usd: number; term_months: number }
        Returns: number
      }
      create_platform_backup: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      distribute_monthly_rental_income: {
        Args: { property_frac_id: string; rental_month?: string }
        Returns: undefined
      }
      get_user_fractional_investments: {
        Args: { wallet_address: string }
        Returns: {
          created_at: string
          current_speculation_price: number
          id: string
          investment_amount: number
          investment_date: string
          investor_wallet_address: string
          monthly_base_rent: number
          ownership_percentage: number
          property_id: string
          property_image_url: string
          property_location: string
          property_name: string
          status: string
          token_amount: number
          total_tokens_available: number
          updated_at: string
        }[]
      }
      get_user_portfolio: {
        Args: { wallet: string }
        Returns: {
          apr_bps: number
          created_at: string
          currency: string
          current_value: number
          down_payment: number
          down_payment_base: number
          equity_percentage: number
          id: string
          image_url: string
          interest_paid_base: number
          is_active: boolean
          loan_amount_base: number
          monthly_payment: number
          mortgage_id: string
          principal_paid_base: number
          property_id: number
          property_location: string
          property_name: string
          purchase_date: string
          purchase_price: number
          purchase_price_base: number
          remaining_balance: number
          remaining_balance_base: number
          term_months: number
          unique_purchase_key: string
          updated_at: string
          user_address: string
          user_wallet_address: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      process_secondary_order_fill: {
        Args: {
          _buyer_wallet_address: string
          _fill_amount: number
          _order_id: string
          _price_per_token: number
          _tx_hash?: string
        }
        Returns: string
      }
      reset_developer_project_funding: {
        Args: { p_project_id?: string }
        Returns: Json
      }
      reset_fractional_portfolio: {
        Args: { p_wallet: string }
        Returns: Json
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
