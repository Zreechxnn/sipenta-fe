'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bidang, CreateBidangDto, UpdateBidangDto } from '@/core/domain/bidang';
import { BidangUseCases } from '@/core/usecases/bidangUseCases';
import { bidangRepository } from '@/infrastructure/repositories/BidangRepository';

const bidangUseCases = new BidangUseCases(bidangRepository);

export function useBidangs(autoFetch: boolean = true) {
  const [bidangs, setBidangs] = useState<Bidang[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBidangs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bidangUseCases.getAllBidangs();
      setBidangs(data);
    } catch (err: any) {
      setError(err?.response?.data?.pesan || err?.message || 'Gagal memuat daftar bidang');
    } finally {
      setLoading(false);
    }
  }, []);

  const createBidang = useCallback(async (dto: CreateBidangDto) => {
    try {
      const created = await bidangUseCases.createBidang(dto);
      setBidangs(prev => [...prev, created]);
      return { ok: true, data: created };
    } catch (err: any) {
      return { ok: false, message: err?.response?.data?.pesan || err?.message || 'Gagal menambahkan bidang' };
    }
  }, []);

  const updateBidang = useCallback(async (id: number, dto: UpdateBidangDto) => {
    try {
      const updated = await bidangUseCases.updateBidang(id, dto);
      setBidangs(prev => prev.map(b => (b.id === id ? updated : b)));
      return { ok: true, data: updated };
    } catch (err: any) {
      return { ok: false, message: err?.response?.data?.pesan || err?.message || 'Gagal memperbarui bidang' };
    }
  }, []);

  const deleteBidang = useCallback(async (id: number) => {
    try {
      await bidangUseCases.deleteBidang(id);
      setBidangs(prev => prev.filter(b => b.id !== id));
      return { ok: true };
    } catch (err: any) {
      return { ok: false, message: err?.response?.data?.pesan || err?.message || 'Gagal menghapus bidang' };
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchBidangs();
    }
  }, [autoFetch, fetchBidangs]);

  return {
    bidangs,
    loading,
    error,
    fetchBidangs,
    createBidang,
    updateBidang,
    deleteBidang,
  };
}
