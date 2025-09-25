import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  AccountBalance as AccountBalanceIcon,
  Payment as PaymentIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';
import type { AppData, UserSettings, GoldPrice } from '../types';
import { CalculationService } from '../services/CalculationService';
import { GoldPriceService } from '../services/GoldPriceService';

interface DashboardProps {
  appData: AppData;
  updateAppData: (newData: AppData) => void;
  settings: UserSettings;
}

const Dashboard = ({ appData, settings }: DashboardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [goldPrice, setGoldPrice] = useState<GoldPrice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGoldPrice = async () => {
      try {
        const price = await GoldPriceService.fetchGoldPrice(settings.currency as 'USD' | 'EUR');
        setGoldPrice(price);
      } catch (error) {
        console.error('Failed to load gold price:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGoldPrice();
  }, [settings.currency]);

