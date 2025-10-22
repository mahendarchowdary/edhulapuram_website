export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      admin_profiles: {
        Row: {
          created_at: string | null;
          full_name: string | null;
          id: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          full_name?: string | null;
          id?: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          full_name?: string | null;
          id?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "admin_profiles_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      site_settings: {
        Row: {
          contact_email: string | null;
          contact_phone: string | null;
          id: string;
          short_name: string | null;
          site_name: string;
          updated_at: string | null;
        };
        Insert: {
          contact_email?: string | null;
          contact_phone?: string | null;
          id?: string;
          short_name?: string | null;
          site_name: string;
          updated_at?: string | null;
        };
        Update: {
          contact_email?: string | null;
          contact_phone?: string | null;
          id?: string;
          short_name?: string | null;
          site_name?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      site_social_links: {
        Row: {
          created_at: string | null;
          icon: string | null;
          id: string;
          platform: string;
          position: number | null;
          updated_at: string | null;
          url: string;
        };
        Insert: {
          created_at?: string | null;
          icon?: string | null;
          id?: string;
          platform: string;
          position?: number | null;
          updated_at?: string | null;
          url: string;
        };
        Update: {
          created_at?: string | null;
          icon?: string | null;
          id?: string;
          platform?: string;
          position?: number | null;
          updated_at?: string | null;
          url?: string;
        };
        Relationships: [];
      };
      navigation_items: {
        Row: {
          created_at: string | null;
          external: boolean | null;
          href: string | null;
          icon: string | null;
          id: string;
          label: string;
          parent_id: string | null;
          position: number | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          external?: boolean | null;
          href?: string | null;
          icon?: string | null;
          id?: string;
          label: string;
          parent_id?: string | null;
          position?: number | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          external?: boolean | null;
          href?: string | null;
          icon?: string | null;
          id?: string;
          label?: string;
          parent_id?: string | null;
          position?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "navigation_items_parent_id_fkey";
            columns: ["parent_id"];
            referencedRelation: "navigation_items";
            referencedColumns: ["id"];
          }
        ];
      };
      hero_sections: {
        Row: {
          background_image_url: string | null;
          id: string;
          subtitle: string | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          background_image_url?: string | null;
          id?: string;
          subtitle?: string | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          background_image_url?: string | null;
          id?: string;
          subtitle?: string | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      hero_ctas: {
        Row: {
          created_at: string | null;
          hero_id: string;
          href: string;
          id: string;
          position: number | null;
          text: string;
          updated_at: string | null;
          variant: string | null;
        };
        Insert: {
          created_at?: string | null;
          hero_id: string;
          href: string;
          id?: string;
          position?: number | null;
          text: string;
          updated_at?: string | null;
          variant?: string | null;
        };
        Update: {
          created_at?: string | null;
          hero_id?: string;
          href?: string;
          id?: string;
          position?: number | null;
          text?: string;
          updated_at?: string | null;
          variant?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "hero_ctas_hero_id_fkey";
            columns: ["hero_id"];
            referencedRelation: "hero_sections";
            referencedColumns: ["id"];
          }
        ];
      };
      news_items: {
        Row: {
          created_at: string | null;
          id: string;
          is_published: boolean | null;
          position: number | null;
          title_en: string;
          title_te: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          is_published?: boolean | null;
          position?: number | null;
          title_en: string;
          title_te?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          is_published?: boolean | null;
          position?: number | null;
          title_en?: string;
          title_te?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      quick_stats: {
        Row: {
          created_at: string | null;
          icon: string | null;
          id: string;
          label: string;
          position: number | null;
          updated_at: string | null;
          value: number | null;
          value_text: string | null;
        };
        Insert: {
          created_at?: string | null;
          icon?: string | null;
          id?: string;
          label: string;
          position?: number | null;
          updated_at?: string | null;
          value?: number | null;
          value_text?: string | null;
        };
        Update: {
          created_at?: string | null;
          icon?: string | null;
          id?: string;
          label?: string;
          position?: number | null;
          updated_at?: string | null;
          value?: number | null;
          value_text?: string | null;
        };
        Relationships: [];
      };
      service_categories: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          name: string;
          position: number | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name: string;
          position?: number | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name?: string;
          position?: number | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      citizen_services: {
        Row: {
          category_id: string | null;
          created_at: string | null;
          external: boolean | null;
          href: string;
          icon: string | null;
          id: string;
          position: number | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          category_id?: string | null;
          created_at?: string | null;
          external?: boolean | null;
          href: string;
          icon?: string | null;
          id?: string;
          position?: number | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          category_id?: string | null;
          created_at?: string | null;
          external?: boolean | null;
          href?: string;
          icon?: string | null;
          id?: string;
          position?: number | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "citizen_services_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "service_categories";
            referencedColumns: ["id"];
          }
        ];
      };
      events: {
        Row: {
          cover_image_url: string | null;
          created_at: string | null;
          description: string | null;
          event_date: string | null;
          id: string;
          position: number | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          cover_image_url?: string | null;
          created_at?: string | null;
          description?: string | null;
          event_date?: string | null;
          id?: string;
          position?: number | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          cover_image_url?: string | null;
          created_at?: string | null;
          description?: string | null;
          event_date?: string | null;
          id?: string;
          position?: number | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      event_gallery: {
        Row: {
          created_at: string | null;
          description: string | null;
          event_id: string;
          id: string;
          image_hint: string | null;
          image_url: string;
          position: number | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          event_id: string;
          id?: string;
          image_hint?: string | null;
          image_url: string;
          position?: number | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          event_id?: string;
          id?: string;
          image_hint?: string | null;
          image_url?: string;
          position?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "event_gallery_event_id_fkey";
            columns: ["event_id"];
            referencedRelation: "events";
            referencedColumns: ["id"];
          }
        ];
      };
      projects: {
        Row: {
          completion: number | null;
          cost: string | null;
          created_at: string | null;
          description: string | null;
          icon: string | null;
          id: string;
          name: string;
          position: number | null;
          slug: string;
          status: string | null;
          timeline: string | null;
          updated_at: string | null;
        };
        Insert: {
          completion?: number | null;
          cost?: string | null;
          created_at?: string | null;
          description?: string | null;
          icon?: string | null;
          id?: string;
          name: string;
          position?: number | null;
          slug: string;
          status?: string | null;
          timeline?: string | null;
          updated_at?: string | null;
        };
        Update: {
          completion?: number | null;
          cost?: string | null;
          created_at?: string | null;
          description?: string | null;
          icon?: string | null;
          id?: string;
          name?: string;
          position?: number | null;
          slug?: string;
          status?: string | null;
          timeline?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      project_gallery: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          image_hint: string | null;
          image_url: string;
          position: number | null;
          project_id: string;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          image_hint?: string | null;
          image_url: string;
          position?: number | null;
          project_id: string;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          image_hint?: string | null;
          image_url?: string;
          position?: number | null;
          project_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_gallery_project_id_fkey";
            columns: ["project_id"];
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      key_officials: {
        Row: {
          bio: string | null;
          created_at: string | null;
          description: string | null;
          designation: string;
          id: string;
          image_hint: string | null;
          image_url: string | null;
          name: string;
          position: number | null;
          updated_at: string | null;
        };
        Insert: {
          bio?: string | null;
          created_at?: string | null;
          description?: string | null;
          designation: string;
          id?: string;
          image_hint?: string | null;
          image_url?: string | null;
          name: string;
          position?: number | null;
          updated_at?: string | null;
        };
        Update: {
          bio?: string | null;
          created_at?: string | null;
          description?: string | null;
          designation?: string;
          id?: string;
          image_hint?: string | null;
          image_url?: string | null;
          name?: string;
          position?: number | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      staff_members: {
        Row: {
          created_at: string | null;
          designation: string;
          id: string;
          name: string;
          phone: string | null;
          priority: number | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          designation: string;
          id?: string;
          name: string;
          phone?: string | null;
          priority?: number | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          designation?: string;
          id?: string;
          name?: string;
          phone?: string | null;
          priority?: number | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      about_basic_info: {
        Row: {
          created_at: string | null;
          icon: string | null;
          id: string;
          label: string;
          position: number | null;
          updated_at: string | null;
          value_numeric: number | null;
          value_text: string | null;
        };
        Insert: {
          created_at?: string | null;
          icon?: string | null;
          id?: string;
          label: string;
          position?: number | null;
          updated_at?: string | null;
          value_numeric?: number | null;
          value_text?: string | null;
        };
        Update: {
          created_at?: string | null;
          icon?: string | null;
          id?: string;
          label?: string;
          position?: number | null;
          updated_at?: string | null;
          value_numeric?: number | null;
          value_text?: string | null;
        };
        Relationships: [];
      };
      about_villages: {
        Row: {
          created_at: string | null;
          id: string;
          name: string;
          position: number | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name: string;
          position?: number | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
          position?: number | null;
        };
        Relationships: [];
      };
      about_infrastructure_sections: {
        Row: {
          created_at: string | null;
          icon: string | null;
          id: string;
          position: number | null;
          section: string;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          icon?: string | null;
          id?: string;
          position?: number | null;
          section: string;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          icon?: string | null;
          id?: string;
          position?: number | null;
          section?: string;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      about_infrastructure_details: {
        Row: {
          created_at: string | null;
          id: string;
          label: string;
          position: number | null;
          section_id: string;
          value: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          label: string;
          position?: number | null;
          section_id: string;
          value: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          label?: string;
          position?: number | null;
          section_id?: string;
          value?: string;
        };
        Relationships: [
          {
            foreignKeyName: "about_infrastructure_details_section_id_fkey";
            columns: ["section_id"];
            referencedRelation: "about_infrastructure_sections";
            referencedColumns: ["id"];
          }
        ];
      };
      about_sanitation_stats: {
        Row: {
          created_at: string | null;
          icon: string | null;
          id: string;
          label: string;
          position: number | null;
          value_text: string | null;
        };
        Insert: {
          created_at?: string | null;
          icon?: string | null;
          id?: string;
          label: string;
          position?: number | null;
          value_text?: string | null;
        };
        Update: {
          created_at?: string | null;
          icon?: string | null;
          id?: string;
          label?: string;
          position?: number | null;
          value_text?: string | null;
        };
        Relationships: [];
      };
      about_sanitation_vehicles: {
        Row: {
          created_at: string | null;
          id: string;
          label: string;
          position: number | null;
          quantity: number | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          label: string;
          position?: number | null;
          quantity?: number | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          label?: string;
          position?: number | null;
          quantity?: number | null;
        };
        Relationships: [];
      };
      about_financials: {
        Row: {
          category: string;
          created_at: string | null;
          extra: Json | null;
          id: string;
          metric: string;
          position: number | null;
          value_numeric: number | null;
          value_text: string | null;
        };
        Insert: {
          category: string;
          created_at?: string | null;
          extra?: Json | null;
          id?: string;
          metric: string;
          position?: number | null;
          value_numeric?: number | null;
          value_text?: string | null;
        };
        Update: {
          category?: string;
          created_at?: string | null;
          extra?: Json | null;
          id?: string;
          metric?: string;
          position?: number | null;
          value_numeric?: number | null;
          value_text?: string | null;
        };
        Relationships: [];
      };
      about_assets: {
        Row: {
          created_at: string | null;
          icon: string | null;
          id: string;
          label: string;
          position: number | null;
          value_numeric: number | null;
        };
        Insert: {
          created_at?: string | null;
          icon?: string | null;
          id?: string;
          label: string;
          position?: number | null;
          value_numeric?: number | null;
        };
        Update: {
          created_at?: string | null;
          icon?: string | null;
          id?: string;
          label?: string;
          position?: number | null;
          value_numeric?: number | null;
        };
        Relationships: [];
      };
      contact_sections: {
        Row: {
          created_at: string | null;
          icon: string | null;
          id: string;
          name: string;
          position: number | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          icon?: string | null;
          id?: string;
          name: string;
          position?: number | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          icon?: string | null;
          id?: string;
          name?: string;
          position?: number | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      contact_numbers: {
        Row: {
          created_at: string | null;
          id: string;
          label: string;
          number: string;
          position: number | null;
          section_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          label: string;
          number: string;
          position?: number | null;
          section_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          label?: string;
          number?: string;
          position?: number | null;
          section_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "contact_numbers_section_id_fkey";
            columns: ["section_id"];
            referencedRelation: "contact_sections";
            referencedColumns: ["id"];
          }
        ];
      };
      footer_links: {
        Row: {
          category: string;
          created_at: string | null;
          href: string;
          id: string;
          label: string;
          position: number | null;
          updated_at: string | null;
        };
        Insert: {
          category: string;
          created_at?: string | null;
          href: string;
          id?: string;
          label: string;
          position?: number | null;
          updated_at?: string | null;
        };
        Update: {
          category?: string;
          created_at?: string | null;
          href?: string;
          id?: string;
          label?: string;
          position?: number | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      footer_metadata: {
        Row: {
          created_at: string | null;
          id: string;
          last_updated: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          last_updated?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          last_updated?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      media_assets: {
        Row: {
          alt_text: string | null;
          created_at: string | null;
          description: string | null;
          file_path: string;
          id: string;
          uploaded_by: string | null;
        };
        Insert: {
          alt_text?: string | null;
          created_at?: string | null;
          description?: string | null;
          file_path: string;
          id?: string;
          uploaded_by?: string | null;
        };
        Update: {
          alt_text?: string | null;
          created_at?: string | null;
          description?: string | null;
          file_path?: string;
          id?: string;
          uploaded_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "media_assets_uploaded_by_fkey";
            columns: ["uploaded_by"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};
