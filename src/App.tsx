import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import type { User } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from './lib/supabase'
import './App.css'

type TransactionType = 'income' | 'expense'
type AuthMode = 'signIn' | 'signUp'

type Transaction = {
  id: string
  type: TransactionType
  amount: number
  category: string
  note: string
  date: string
}

type Profile = {
  name: string
  email: string
  avatar: string
  emailNotifications: boolean
}

type ProfileTextField = 'name' | 'email' | 'avatar'

type AppState = {
  profile: Profile
  transactions: Transaction[]
  isBankConnected: boolean
}

type Account = {
  id: string
  institution: string
  label: string
  kind: string
  amount: number
  tone: 'asset' | 'debt' | 'saving'
}

const incomeCategories = ['Maaş', 'Ek gelir', 'Yatırım', 'Hediye', 'Diğer']
const expenseCategories = ['Market', 'Fatura', 'Kira', 'Ulaşım', 'Sağlık', 'Eğitim', 'Eğlence', 'Diğer']

const literacyTips = [
  'Önce birikimi ayır, sonra harcamayı planla.',
  'Kredi kartı borcunu bütçenin parçası olarak takip et.',
  'Küçük harcamalar ay sonunda büyük fark yaratır.',
  'Acil durum fonu finansal özgürlüğün ilk basamağıdır.',
]

const quotes = [
  'Paranı yönetmek, gelecekteki seçeneklerini korumaktır.',
  'Bütçe kısıtlama değil, karar verme aracıdır.',
  'Bugünkü küçük düzen, yarınki büyük rahatlıktır.',
]

const demoAccounts: Account[] = [
  {
    id: 'checking',
    institution: 'Demo Bank',
    label: 'Vadesiz TL',
    kind: 'Bakiye',
    amount: 32650,
    tone: 'asset',
  },
  {
    id: 'credit-card',
    institution: 'Demo Kart',
    label: 'Kredi kartı',
    kind: 'Dönem borcu',
    amount: -8420,
    tone: 'debt',
  },
  {
    id: 'deposit',
    institution: 'Demo Bank',
    label: 'Vadeli hesap',
    kind: 'Birikim',
    amount: 52000,
    tone: 'saving',
  },
  {
    id: 'gold',
    institution: 'Demo Yatırım',
    label: 'Altın hesabı',
    kind: 'Portföy değeri',
    amount: 18800,
    tone: 'saving',
  },
]

const demoState: AppState = {
  profile: {
    name: 'İrem Bayraktar',
    email: 'irem@example.com',
    avatar: '',
    emailNotifications: true,
  },
  isBankConnected: false,
  transactions: [
    {
      id: 't1',
      type: 'income',
      amount: 48000,
      category: 'Maaş',
      note: 'Haziran maaşı',
      date: '2026-06-03',
    },
    {
      id: 't2',
      type: 'expense',
      amount: 14500,
      category: 'Kira',
      note: 'Ev kirası',
      date: '2026-06-05',
    },
    {
      id: 't3',
      type: 'expense',
      amount: 3850,
      category: 'Market',
      note: 'Haftalık alışveriş',
      date: '2026-06-12',
    },
    {
      id: 't4',
      type: 'income',
      amount: 4200,
      category: 'Ek gelir',
      note: 'Freelance tasarım',
      date: '2026-06-15',
    },
    {
      id: 't5',
      type: 'expense',
      amount: 1750,
      category: 'Ulaşım',
      note: 'Kart dolumu',
      date: '2026-06-17',
    },
  ],
}

const emptyCloudState: AppState = {
  profile: {
    name: '',
    email: '',
    avatar: '',
    emailNotifications: true,
  },
  isBankConnected: false,
  transactions: [],
}

const storageKey = 'finans-pusulam-state-v1'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(value)
}

function loadState(): AppState {
  if (isSupabaseConfigured) {
    return emptyCloudState
  }

  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) {
      return demoState
    }

    const parsed = JSON.parse(raw)

    return {
      ...demoState,
      ...parsed,
      profile: {
        ...demoState.profile,
        ...parsed.profile,
      },
    }
  } catch {
    return demoState
  }
}

function mapTransaction(row: {
  id: string
  type: string
  amount: number | string
  category: string
  note: string | null
  transaction_date: string
}): Transaction {
  return {
    id: row.id,
    type: row.type as TransactionType,
    amount: Number(row.amount),
    category: row.category,
    note: row.note || 'Not eklenmedi',
    date: row.transaction_date,
  }
}

function App() {
  const [appState, setAppState] = useState<AppState>(loadState)
  const [form, setForm] = useState({
    type: 'expense' as TransactionType,
    amount: '',
    category: 'Market',
    note: '',
    date: new Date().toISOString().slice(0, 10),
  })
  const [user, setUser] = useState<User | null>(null)
  const [authMode, setAuthMode] = useState<AuthMode>('signIn')
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' })
  const [authLoading, setAuthLoading] = useState(isSupabaseConfigured)
  const [dataLoading, setDataLoading] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      localStorage.setItem(storageKey, JSON.stringify(appState))
    }
  }, [appState])

  useEffect(() => {
    if (!supabase) {
      return
    }

    let mounted = true

    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) {
        return
      }

      setUser(data.user)
      setAuthLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!supabase || !user) {
      return
    }

    const client = supabase

    async function loadCloudData(currentUser: User) {
      setDataLoading(true)
      setNotice(null)

      const { data: profileData, error: profileError } = await client
        .from('profiles')
        .select('full_name, avatar_url, email_notifications')
        .eq('id', currentUser.id)
        .maybeSingle()

      if (profileError) {
        setNotice(profileError.message)
      }

      if (!profileData) {
        const fallbackName = currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || ''
        await client.from('profiles').upsert({
          id: currentUser.id,
          full_name: fallbackName,
          avatar_url: null,
          email_notifications: true,
        })
      }

      const { data: transactionsData, error: transactionsError } = await client
        .from('transactions')
        .select('id, type, amount, category, note, transaction_date')
        .order('transaction_date', { ascending: false })

      if (transactionsError) {
        setNotice(transactionsError.message)
      }

      setAppState((current) => ({
        ...current,
        profile: {
          name:
            profileData?.full_name ||
            currentUser.user_metadata?.full_name ||
            currentUser.email?.split('@')[0] ||
            '',
          email: currentUser.email || '',
          avatar: profileData?.avatar_url || '',
          emailNotifications: profileData?.email_notifications ?? true,
        },
        transactions: (transactionsData || []).map(mapTransaction),
      }))
      setDataLoading(false)
    }

    loadCloudData(user)
  }, [user])

  const totals = useMemo(() => {
    const income = appState.transactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((sum, transaction) => sum + transaction.amount, 0)
    const expense = appState.transactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((sum, transaction) => sum + transaction.amount, 0)

    return {
      income,
      expense,
      balance: income - expense,
      savingsRate: income > 0 ? Math.round(((income - expense) / income) * 100) : 0,
    }
  }, [appState.transactions])

  const categorySummary = useMemo(() => {
    return expenseCategories
      .map((category) => {
        const total = appState.transactions
          .filter((transaction) => transaction.type === 'expense' && transaction.category === category)
          .reduce((sum, transaction) => sum + transaction.amount, 0)

        return {
          category,
          total,
          ratio: totals.expense > 0 ? Math.round((total / totals.expense) * 100) : 0,
        }
      })
      .filter((item) => item.total > 0)
      .sort((a, b) => b.total - a.total)
  }, [appState.transactions, totals.expense])

  const monthlyInsight = useMemo(() => {
    if (totals.savingsRate >= 25) {
      return 'Bu ay güçlü bir birikim oranı yakaladın. Aynı ritmi korursan hedeflerine daha hızlı yaklaşırsın.'
    }

    if (totals.balance < 0) {
      return 'Giderler gelirleri aşmış görünüyor. Önce sabit giderleri ve kart borcunu birlikte kontrol edelim.'
    }

    return 'Denge iyi, ama birikim oranını artırmak için en büyük gider kategorisine küçük bir sınır koyabilirsin.'
  }, [totals.balance, totals.savingsRate])

  async function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!supabase) {
      return
    }

    setAuthLoading(true)
    setNotice(null)

    if (authMode === 'signUp') {
      const { data, error } = await supabase.auth.signUp({
        email: authForm.email,
        password: authForm.password,
        options: {
          data: {
            full_name: authForm.name,
          },
        },
      })

      if (error) {
        setNotice(error.message)
      } else if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: authForm.name,
          avatar_url: null,
          email_notifications: true,
        })
        setNotice('Kayıt oluşturuldu. E-posta doğrulaması açıksa gelen kutunu kontrol et.')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: authForm.email,
        password: authForm.password,
      })

      if (error) {
        setNotice(error.message)
      }
    }

    setAuthLoading(false)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const amount = Number(form.amount)

    if (!amount || amount <= 0) {
      return
    }

    const transaction: Transaction = {
      id: crypto.randomUUID(),
      type: form.type,
      amount,
      category: form.category,
      note: form.note.trim() || 'Not eklenmedi',
      date: form.date,
    }

    if (supabase && user) {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: transaction.type,
          amount: transaction.amount,
          category: transaction.category,
          note: transaction.note,
          transaction_date: transaction.date,
        })
        .select('id, type, amount, category, note, transaction_date')
        .single()

      if (error) {
        setNotice(error.message)
        return
      }

      setAppState((current) => ({
        ...current,
        transactions: [mapTransaction(data), ...current.transactions],
      }))
    } else {
      setAppState((current) => ({
        ...current,
        transactions: [transaction, ...current.transactions],
      }))
    }

    setForm((current) => ({
      ...current,
      amount: '',
      note: '',
    }))
  }

  async function handleAvatarUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    if (supabase && user) {
      const extension = file.name.split('.').pop() || 'jpg'
      const path = `${user.id}/avatar.${extension}`
      const { error } = await supabase.storage.from('avatars').upload(path, file, {
        upsert: true,
        cacheControl: '3600',
      })

      if (error) {
        setNotice(error.message)
        return
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(path)

      await supabase.from('profiles').upsert({
        id: user.id,
        full_name: appState.profile.name,
        avatar_url: publicUrl,
        email_notifications: appState.profile.emailNotifications,
      })

      setAppState((current) => ({
        ...current,
        profile: {
          ...current.profile,
          avatar: publicUrl,
        },
      }))
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setAppState((current) => ({
        ...current,
        profile: {
          ...current.profile,
          avatar: String(reader.result),
        },
      }))
    }
    reader.readAsDataURL(file)
  }

  async function deleteTransaction(id: string) {
    if (supabase && user) {
      const { error } = await supabase.from('transactions').delete().eq('id', id).eq('user_id', user.id)

      if (error) {
        setNotice(error.message)
        return
      }
    }

    setAppState((current) => ({
      ...current,
      transactions: current.transactions.filter((transaction) => transaction.id !== id),
    }))
  }

  function updateProfile(field: ProfileTextField, value: string) {
    setAppState((current) => ({
      ...current,
      profile: {
        ...current.profile,
        [field]: value,
      },
    }))
  }

  function updateEmailNotifications(value: boolean) {
    setAppState((current) => ({
      ...current,
      profile: {
        ...current.profile,
        emailNotifications: value,
      },
    }))
  }

  async function saveProfile() {
    if (!supabase || !user) {
      setNotice('Demo modda profil tarayıcıda saklanır.')
      return
    }

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      full_name: appState.profile.name,
      avatar_url: appState.profile.avatar || null,
      email_notifications: appState.profile.emailNotifications,
    })

    setNotice(error ? error.message : 'Profil kaydedildi.')
  }

  async function signOut() {
    if (!supabase) {
      return
    }

    await supabase.auth.signOut()
    setUser(null)
    setAppState(emptyCloudState)
  }

  const randomTip = literacyTips[appState.transactions.length % literacyTips.length]
  const randomQuote = quotes[appState.transactions.length % quotes.length]

  if (authLoading) {
    return (
      <main className="auth-shell">
        <section className="auth-card">
          <span className="eyebrow">Finans Pusulam</span>
          <h1>Hesap durumu kontrol ediliyor</h1>
          <p>Güvenli oturum bilgisi hazırlanıyor.</p>
        </section>
      </main>
    )
  }

  if (isSupabaseConfigured && !user) {
    return (
      <main className="auth-shell">
        <form className="auth-card" onSubmit={handleAuthSubmit}>
          <span className="eyebrow">Gerçek ürün modu</span>
          <h1>Finans Pusulam</h1>
          <p>Kendi hesabınla giriş yap, finans kayıtlarını güvenli şekilde sakla.</p>

          <div className="segmented" role="group" aria-label="Giriş modu">
            <button
              type="button"
              className={authMode === 'signIn' ? 'active' : ''}
              onClick={() => setAuthMode('signIn')}
            >
              Giriş
            </button>
            <button
              type="button"
              className={authMode === 'signUp' ? 'active' : ''}
              onClick={() => setAuthMode('signUp')}
            >
              Kayıt
            </button>
          </div>

          {authMode === 'signUp' && (
            <label>
              Ad soyad
              <input
                value={authForm.name}
                onChange={(event) => setAuthForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="İrem Bayraktar"
              />
            </label>
          )}

          <label>
            E-posta
            <input
              type="email"
              value={authForm.email}
              onChange={(event) => setAuthForm((current) => ({ ...current, email: event.target.value }))}
              placeholder="irem@example.com"
              required
            />
          </label>

          <label>
            Şifre
            <input
              type="password"
              minLength={6}
              value={authForm.password}
              onChange={(event) => setAuthForm((current) => ({ ...current, password: event.target.value }))}
              placeholder="En az 6 karakter"
              required
            />
          </label>

          {notice && <p className="notice">{notice}</p>}

          <button type="submit" className="primary-button">
            {authMode === 'signIn' ? 'Giriş yap' : 'Hesap oluştur'}
          </button>
        </form>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Kullanıcı ve hedef özeti">
        <section className="profile-panel">
          <div className="avatar" aria-label="Profil fotoğrafı">
            {appState.profile.avatar ? <img src={appState.profile.avatar} alt="" /> : <span>İB</span>}
          </div>

          <label className="file-upload">
            Fotoğraf yükle
            <input type="file" accept="image/*" onChange={handleAvatarUpload} />
          </label>

          <label>
            Ad soyad
            <input value={appState.profile.name} onChange={(event) => updateProfile('name', event.target.value)} />
          </label>

          <label>
            E-posta
            <input
              type="email"
              value={appState.profile.email}
              onChange={(event) => updateProfile('email', event.target.value)}
              disabled={Boolean(user)}
            />
          </label>

          <label className="toggle-row">
            <input
              type="checkbox"
              checked={appState.profile.emailNotifications}
              onChange={(event) => updateEmailNotifications(event.target.checked)}
            />
            <span>Aylık özet maili</span>
          </label>

          <button type="button" className="sidebar-button" onClick={saveProfile}>
            Profili kaydet
          </button>
        </section>

        <section className="quote-panel">
          <span className="eyebrow">Bugünün notu</span>
          <p>{randomQuote}</p>
        </section>
      </aside>

      <section className="workspace" aria-label="Finans takip çalışma alanı">
        <header className="topbar">
          <div>
            <span className="eyebrow">{isSupabaseConfigured ? 'Bulut kayıtlı kişisel finans paneli' : 'Demo kişisel finans paneli'}</span>
            <h1>Finans Pusulam</h1>
          </div>
          <div className="topbar-actions">
            <span className="mode-badge">{isSupabaseConfigured ? 'Supabase modu' : 'Demo modu'}</span>
            <button
              type="button"
              className="ghost-button"
              onClick={() => setAppState((current) => ({ ...current, isBankConnected: !current.isBankConnected }))}
            >
              {appState.isBankConnected ? 'Demo bankayı kaldır' : 'Demo banka bağla'}
            </button>
            {user && (
              <button type="button" className="ghost-button" onClick={signOut}>
                Çıkış yap
              </button>
            )}
          </div>
        </header>

        {notice && <p className="notice">{notice}</p>}
        {dataLoading && <p className="notice">Veriler yükleniyor...</p>}

        <section className="metric-grid" aria-label="Aylık özet">
          <article className="metric income">
            <span>Toplam gelir</span>
            <strong>{formatCurrency(totals.income)}</strong>
          </article>
          <article className="metric expense">
            <span>Toplam gider</span>
            <strong>{formatCurrency(totals.expense)}</strong>
          </article>
          <article className="metric balance">
            <span>Kalan bakiye</span>
            <strong>{formatCurrency(totals.balance)}</strong>
          </article>
          <article className="metric rate">
            <span>Birikim oranı</span>
            <strong>%{totals.savingsRate}</strong>
          </article>
        </section>

        <section className="main-grid">
          <form className="entry-panel" onSubmit={handleSubmit}>
            <div className="panel-heading">
              <span className="eyebrow">Yeni kayıt</span>
              <h2>Gelir veya gider ekle</h2>
            </div>

            <div className="segmented" role="group" aria-label="Kayıt tipi">
              <button
                type="button"
                className={form.type === 'income' ? 'active' : ''}
                onClick={() => setForm((current) => ({ ...current, type: 'income', category: 'Maaş' }))}
              >
                Gelir
              </button>
              <button
                type="button"
                className={form.type === 'expense' ? 'active' : ''}
                onClick={() => setForm((current) => ({ ...current, type: 'expense', category: 'Market' }))}
              >
                Gider
              </button>
            </div>

            <label>
              Tutar
              <input
                inputMode="decimal"
                placeholder="2500"
                value={form.amount}
                onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))}
              />
            </label>

            <label>
              Kategori
              <select
                value={form.category}
                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
              >
                {(form.type === 'income' ? incomeCategories : expenseCategories).map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>

            <label>
              Tarih
              <input
                type="date"
                value={form.date}
                onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
              />
            </label>

            <label>
              Not
              <textarea
                rows={3}
                placeholder="Kısa açıklama"
                value={form.note}
                onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
              />
            </label>

            <button type="submit" className="primary-button">
              Kaydı ekle
            </button>
          </form>

          <section className="insight-panel">
            <div className="panel-heading">
              <span className="eyebrow">Finans okuryazarlığı</span>
              <h2>Bu ayın yorumu</h2>
            </div>
            <p>{monthlyInsight}</p>
            <div className="tip-box">
              <span>İpucu</span>
              <strong>{randomTip}</strong>
            </div>
          </section>

          <section className="category-panel">
            <div className="panel-heading">
              <span className="eyebrow">Gider dağılımı</span>
              <h2>Kategoriler</h2>
            </div>
            <div className="category-list">
              {categorySummary.map((item) => (
                <div className="category-row" key={item.category}>
                  <div>
                    <strong>{item.category}</strong>
                    <span>{formatCurrency(item.total)}</span>
                  </div>
                  <div className="progress" aria-label={`${item.category} oranı yüzde ${item.ratio}`}>
                    <span style={{ width: `${item.ratio}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </section>

        <section className="bank-panel" aria-label="Demo banka hesapları">
          <div className="panel-heading">
            <span className="eyebrow">Açık bankacılık hazırlığı</span>
            <h2>Bağlı hesaplar</h2>
          </div>

          {appState.isBankConnected ? (
            <div className="account-grid">
              {demoAccounts.map((account) => (
                <article className={`account ${account.tone}`} key={account.id}>
                  <span>{account.institution}</span>
                  <h3>{account.label}</h3>
                  <p>{account.kind}</p>
                  <strong>{formatCurrency(account.amount)}</strong>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-bank">
              <p>
                Gerçek entegrasyon yerine demo bağlantı kullanılır. Kullanıcı banka şifresi, token veya gerçek hesap
                bilgisi bu uygulamada saklanmaz.
              </p>
            </div>
          )}
        </section>

        <section className="transaction-panel">
          <div className="panel-heading">
            <span className="eyebrow">Son hareketler</span>
            <h2>Gelir ve gider kayıtları</h2>
          </div>

          <div className="transaction-list">
            {appState.transactions.map((transaction) => (
              <article className="transaction" key={transaction.id}>
                <div className={`type-dot ${transaction.type}`} aria-hidden="true" />
                <div>
                  <strong>{transaction.note}</strong>
                  <span>
                    {transaction.category} · {new Intl.DateTimeFormat('tr-TR').format(new Date(transaction.date))}
                  </span>
                </div>
                <strong className={transaction.type}>
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </strong>
                <button type="button" onClick={() => deleteTransaction(transaction.id)} aria-label="Kaydı sil">
                  Sil
                </button>
              </article>
            ))}

            {appState.transactions.length === 0 && (
              <div className="empty-bank">
                <p>Henüz kayıt yok. İlk gelir veya giderini ekleyerek başlayabilirsin.</p>
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  )
}

export default App
