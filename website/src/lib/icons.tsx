import {
  Video,
  Users,
  BookOpen,
  Award,
  PlayCircle,
  Newspaper,
  BarChart3,
  Brain,
  MessageCircle,
  Send,
  Rocket,
  Truck,
  Banknote,
  RotateCcw,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

/**
 * Maps icon name strings (stored in content JSON via Decap CMS)
 * to actual Lucide icon components.
 *
 * When adding a new icon option in public/admin/config.yml,
 * remember to register it here too.
 */
const iconMap: Record<string, LucideIcon> = {
  // Stats / general
  video: Video,
  users: Users,
  book: BookOpen,
  award: Award,
  send: Send,
  rocket: Rocket,

  // Features
  play: PlayCircle,
  newspaper: Newspaper,
  chart: BarChart3,
  brain: Brain,
  message: MessageCircle,

  // Trust badges
  truck: Truck,
  banknote: Banknote,
  return: RotateCcw,
};

/**
 * Resolve an icon name from content JSON into a Lucide component.
 * Falls back to CheckCircle2 if the name is unknown, so the UI never breaks
 * when someone types an unexpected value in the CMS.
 */
export function getIcon(name?: string): LucideIcon {
  if (!name) return CheckCircle2;
  return iconMap[name] ?? CheckCircle2;
}
