# Bench results (Baseline is from 1.2.7 and results are from 1.2.5)

```bash
better-auth-ts-perf on  main [!?] via  v18.20.2 on   (us-east-1) took 5s 
❯ p bench

> better-auth-next-app-starter@0.1.0 bench /Users/mendy/dev/better-auth-ts-perf
> tsx bench.ts

🏌️  plain
⛳ Result: 415 instantiations
🎯 Baseline: 13 instantiations
📈 'plain' exceeded baseline by 3092.31% (threshold is 20%).

🏌️  drizzle
⛳ Result: 59085 instantiations
🎯 Baseline: 58682 instantiations
📊 Delta: +0.69%

🏌️  org
⛳ Result: 66876 instantiations
🎯 Baseline: 62542 instantiations
📊 Delta: +6.93%

🏌️  admin
⛳ Result: 64768 instantiations
🎯 Baseline: 61512 instantiations
📊 Delta: +5.29%

🏌️  emailOTP
⛳ Result: 61915 instantiations
🎯 Baseline: 59996 instantiations
📊 Delta: +3.20%

🏌️  magicLink
⛳ Result: 59977 instantiations
🎯 Baseline: 58926 instantiations
📊 Delta: +1.78%

🏌️  phoneNumber
⛳ Result: 60830 instantiations
🎯 Baseline: 59000 instantiations
📊 Delta: +3.10%

🏌️  genericOAuth
⛳ Result: 61354 instantiations
🎯 Baseline: 60138 instantiations
📊 Delta: +2.02%

🏌️  username
⛳ Result: 59989 instantiations
🎯 Baseline: 59718 instantiations
📊 Delta: +0.45%

🏌️  oneTap
⛳ Result: 59528 instantiations
🎯 Baseline: 58793 instantiations
📊 Delta: +1.25%

🏌️  all
⛳ Result: 79587 instantiations
🎯 Baseline: 66967 instantiations
📊 Delta: +18.85%

🏌️  my-project
⛳ Result: 77500 instantiations
🎯 Baseline: 68410 instantiations
📊 Delta: +13.29%
```