import React from 'react';
import {
  Percent,
  Tag,
  TrendingUp,
  CreditCard,
  Briefcase,
  Calculator,
  ArrowLeftRight,
  CalendarClock,
  Activity,
  Sparkles,
  Divide,
  ArrowUpDown,
  Layers,
  Ruler,
  Scale,
  Maximize2,
  Box,
  Thermometer,
  Gauge,
  Hourglass,
  CalendarRange,
  CalendarPlus,
  CalendarMinus,
  Clock,
  HeartPulse,
  Flame,
  Wallet,
  Zap,
  LayoutGrid,
  Boxes,
  BadgePercent,
  HelpCircle,
} from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({
  name,
  className = 'w-5 h-5',
}) => {
  switch (name) {
    case 'Percent':
      return <Percent className={className} />;
    case 'Tag':
      return <Tag className={className} />;
    case 'TrendingUp':
      return <TrendingUp className={className} />;
    case 'CreditCard':
      return <CreditCard className={className} />;
    case 'Briefcase':
      return <Briefcase className={className} />;
    case 'Calculator':
      return <Calculator className={className} />;
    case 'ArrowLeftRight':
      return <ArrowLeftRight className={className} />;
    case 'CalendarClock':
      return <CalendarClock className={className} />;
    case 'Activity':
      return <Activity className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Divide':
      return <Divide className={className} />;
    case 'ArrowUpDown':
      return <ArrowUpDown className={className} />;
    case 'Layers':
      return <Layers className={className} />;
    case 'Ruler':
      return <Ruler className={className} />;
    case 'Scale':
      return <Scale className={className} />;
    case 'Maximize2':
      return <Maximize2 className={className} />;
    case 'Box':
      return <Box className={className} />;
    case 'Thermometer':
      return <Thermometer className={className} />;
    case 'Gauge':
      return <Gauge className={className} />;
    case 'Hourglass':
      return <Hourglass className={className} />;
    case 'CalendarRange':
      return <CalendarRange className={className} />;
    case 'CalendarPlus':
      return <CalendarPlus className={className} />;
    case 'CalendarMinus':
      return <CalendarMinus className={className} />;
    case 'Clock':
      return <Clock className={className} />;
    case 'HeartPulse':
      return <HeartPulse className={className} />;
    case 'Flame':
      return <Flame className={className} />;
    case 'Wallet':
      return <Wallet className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'LayoutGrid':
      return <LayoutGrid className={className} />;
    case 'Boxes':
      return <Boxes className={className} />;
    case 'BadgePercent':
      return <BadgePercent className={className} />;
    default:
      return <Calculator className={className} />;
  }
};
