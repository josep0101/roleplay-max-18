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
      agent_calls: {
        Row: {
          agent_id: string
          created_at: string
          duration: number
          id: string
          status: string
          transcript: string | null
        }
        Insert: {
          agent_id: string
          created_at?: string
          duration: number
          id?: string
          status: string
          transcript?: string | null
        }
        Update: {
          agent_id?: string
          created_at?: string
          duration?: number
          id?: string
          status?: string
          transcript?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_calls_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agents: {
        Row: {
          business_type: string
          calendar_enabled: boolean | null
          calendar_id: string | null
          created_at: string
          description: string | null
          elevenlabs_agent_id: string | null
          id: string
          name: string
          phone_enabled: boolean | null
          phone_number: string | null
          prompt: string
          updated_at: string
          user_id: string
          voice_id: string
        }
        Insert: {
          business_type: string
          calendar_enabled?: boolean | null
          calendar_id?: string | null
          created_at?: string
          description?: string | null
          elevenlabs_agent_id?: string | null
          id?: string
          name: string
          phone_enabled?: boolean | null
          phone_number?: string | null
          prompt: string
          updated_at?: string
          user_id: string
          voice_id: string
        }
        Update: {
          business_type?: string
          calendar_enabled?: boolean | null
          calendar_id?: string | null
          created_at?: string
          description?: string | null
          elevenlabs_agent_id?: string | null
          id?: string
          name?: string
          phone_enabled?: boolean | null
          phone_number?: string | null
          prompt?: string
          updated_at?: string
          user_id?: string
          voice_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_attendees: {
        Row: {
          created_at: string
          event_id: string
          id: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_attendees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_attendees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          creator_id: string
          description: string
          end_date: string
          event_type: string
          id: string
          image_url: string | null
          location: string | null
          max_attendees: number | null
          meeting_url: string | null
          start_date: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          description: string
          end_date: string
          event_type: string
          id?: string
          image_url?: string | null
          location?: string | null
          max_attendees?: number | null
          meeting_url?: string | null
          start_date: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          description?: string
          end_date?: string
          event_type?: string
          id?: string
          image_url?: string | null
          location?: string | null
          max_attendees?: number | null
          meeting_url?: string | null
          start_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      expertise_areas: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      idea_evaluations: {
        Row: {
          created_at: string
          expert_id: string
          gtm_ease: number
          id: string
          idea_id: string
          market_timing: number
          marketing_channels: number
          mvp_resources: number
          pain_point: number
          technical_difficulty: number
          viral_potential: number
          wow_effect: number
        }
        Insert: {
          created_at?: string
          expert_id: string
          gtm_ease: number
          id?: string
          idea_id: string
          market_timing: number
          marketing_channels: number
          mvp_resources: number
          pain_point: number
          technical_difficulty: number
          viral_potential?: number
          wow_effect?: number
        }
        Update: {
          created_at?: string
          expert_id?: string
          gtm_ease?: number
          id?: string
          idea_id?: string
          market_timing?: number
          marketing_channels?: number
          mvp_resources?: number
          pain_point?: number
          technical_difficulty?: number
          viral_potential?: number
          wow_effect?: number
        }
        Relationships: [
          {
            foreignKeyName: "idea_evaluations_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "idea_evaluations_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      idea_required_expertise: {
        Row: {
          area_id: string
          created_at: string
          id: string
          idea_id: string
        }
        Insert: {
          area_id: string
          created_at?: string
          id?: string
          idea_id: string
        }
        Update: {
          area_id?: string
          created_at?: string
          id?: string
          idea_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "idea_required_expertise_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "expertise_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "idea_required_expertise_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      idea_validations: {
        Row: {
          comment: string | null
          created_at: string
          expert_id: string
          id: string
          idea_id: string
          vote: boolean
        }
        Insert: {
          comment?: string | null
          created_at?: string
          expert_id: string
          id?: string
          idea_id: string
          vote: boolean
        }
        Update: {
          comment?: string | null
          created_at?: string
          expert_id?: string
          id?: string
          idea_id?: string
          vote?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "idea_validations_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "idea_validations_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      ideas: {
        Row: {
          assigned_expert_id: string | null
          created_at: string
          creator_id: string
          description: string
          id: string
          image_url: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          assigned_expert_id?: string | null
          created_at?: string
          creator_id: string
          description: string
          id?: string
          image_url?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          assigned_expert_id?: string | null
          created_at?: string
          creator_id?: string
          description?: string
          id?: string
          image_url?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ideas_assigned_expert_id_fkey"
            columns: ["assigned_expert_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ideas_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          location: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          location?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          location?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      user_expertise: {
        Row: {
          area_id: string
          created_at: string
          id: string
          user_id: string
          years_experience: number | null
        }
        Insert: {
          area_id: string
          created_at?: string
          id?: string
          user_id: string
          years_experience?: number | null
        }
        Update: {
          area_id?: string
          created_at?: string
          id?: string
          user_id?: string
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_expertise_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "expertise_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_expertise_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_elevenlabs_key: {
        Args: Record<PropertyKey, never>
        Returns: {
          secret: string
        }[]
      }
      secrets: {
        Args: {
          secret_name: string
        }
        Returns: {
          secret: string
        }[]
      }
    }
    Enums: {
      user_role: "admin" | "expert" | "entrepreneur" | "investor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
