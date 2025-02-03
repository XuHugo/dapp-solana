'use client'

import { getCrudProgram, getCrudProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'
import { title } from 'process'

interface CreateEntryArgs {
  title: string,
  message: string,
  owner: PublicKey
}
export function useCrudProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getCrudProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getCrudProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['crud', 'all', { cluster }],
    queryFn: () => program.account.journalEntry.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const createEntry = useMutation<string, Error, CreateEntryArgs>({
    mutationKey: ['crud', 'create', { cluster }],
    mutationFn: async ({ title, message, owner }) => {
      return program.methods.createJournalEntry(title, message).rpc();
    },

    onSuccess: (signature) => {
      transactionToast(signature);
      return accounts.refetch()
    },
    onError: (error) => {
      toast.error('Failed to create entry:$(error.message)')
    }
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    createEntry,
  }
}

export function useCrudProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useCrudProgram()

  const accountQuery = useQuery({
    queryKey: ['crud', 'fetch', { cluster, account }],
    queryFn: () => program.account.journalEntry.fetch(account),
  })

  const updateEntry = useMutation<string, Error, CreateEntryArgs>({
    mutationKey: ['crud', 'update', { cluster }],
    mutationFn: async ({ title, message }) => {
      return program.methods.updateJournalEntry(title, message).rpc();
    },
    onSuccess: (tx) => {
      transactionToast(tx);
      return accounts.refetch()
    },
    onError: (error) => {
      toast.error('Failed to update entry: $(error.message)');
    }
  })

  const deleteEntry = useMutation({
    mutationKey: ['crud', 'delete', { cluster }],
    mutationFn: async (title: string) => {
      return program.methods.deleteJournalEntry(title).rpc();
    },
    onSuccess: (tx) => {
      transactionToast(tx);
      return accounts.refetch()
    },
    onError: (error) => {
      toast.error('Failed to delete entry: $(error.message)');
    }
  })

  return {
    accountQuery,
    updateEntry,
    deleteEntry
  }
}
