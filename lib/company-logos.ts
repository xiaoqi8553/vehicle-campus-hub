export type CompanyLogoMeta = {
  path: string;
  sourceUrl: string;
  status: "official-favicon" | "neutral-fallback";
};

export const COMPANY_LOGOS: Record<string, CompanyLogoMeta> = {
  "xiaomi-auto": {
    path: "/company-logos/xiaomi-auto.ico",
    sourceUrl: "https://www.mi.com/favicon.ico",
    status: "official-favicon",
  },
  "li-auto": {
    path: "/company-logos/li-auto.ico",
    sourceUrl: "https://www.lixiang.com/favicon.ico",
    status: "official-favicon",
  },
  nio: {
    path: "/company-logos/nio.svg",
    sourceUrl: "https://www.nio.cn/",
    status: "neutral-fallback",
  },
  xpeng: {
    path: "/company-logos/xpeng.ico",
    sourceUrl: "https://www.xiaopeng.com/favicon.ico",
    status: "official-favicon",
  },
  leapmotor: {
    path: "/company-logos/leapmotor.svg",
    sourceUrl: "https://www.leapmotor.com/",
    status: "neutral-fallback",
  },
  zeekr: {
    path: "/company-logos/zeekr.png",
    sourceUrl: "https://www.zeekrgroup.com/favicon.ico",
    status: "official-favicon",
  },
  tesla: {
    path: "/company-logos/tesla.ico",
    sourceUrl: "https://www.tesla.cn/favicon.ico",
    status: "official-favicon",
  },
  byd: {
    path: "/company-logos/byd.svg",
    sourceUrl: "https://www.bydglobal.com/cn/",
    status: "neutral-fallback",
  },
  geely: {
    path: "/company-logos/geely.ico",
    sourceUrl: "https://www.geely.com/favicon.ico",
    status: "official-favicon",
  },
  changan: {
    path: "/company-logos/changan.ico",
    sourceUrl: "https://www.changan.com.cn/favicon.ico",
    status: "official-favicon",
  },
  gac: {
    path: "/company-logos/gac.webp",
    sourceUrl: "https://www.gac.com.cn/favicon.ico",
    status: "official-favicon",
  },
  saic: {
    path: "/company-logos/saic.ico",
    sourceUrl: "https://www.saicmotor.com/favicon.ico",
    status: "official-favicon",
  },
  faw: {
    path: "/company-logos/faw.svg",
    sourceUrl: "https://www.faw.com.cn/",
    status: "neutral-fallback",
  },
  dongfeng: {
    path: "/company-logos/dongfeng.ico",
    sourceUrl: "https://www.dfmc.com.cn/favicon.ico",
    status: "official-favicon",
  },
  "great-wall": {
    path: "/company-logos/great-wall.ico",
    sourceUrl: "https://www.gwm.com.cn/favicon.ico",
    status: "official-favicon",
  },
  catl: {
    path: "/company-logos/catl.ico",
    sourceUrl: "https://www.catl.com/favicon.ico",
    status: "official-favicon",
  },
  calb: {
    path: "/company-logos/calb.ico",
    sourceUrl: "https://www.calb-tech.com/favicon.ico",
    status: "official-favicon",
  },
  bosch: {
    path: "/company-logos/bosch.ico",
    sourceUrl: "https://www.bosch.com.cn/favicon.ico",
    status: "official-favicon",
  },
  continental: {
    path: "/company-logos/continental.ico",
    sourceUrl: "https://www.continental.com/favicon.ico",
    status: "official-favicon",
  },
  zf: {
    path: "/company-logos/zf.png",
    sourceUrl: "https://www.zf.com/favicon.ico",
    status: "official-favicon",
  },
  denso: {
    path: "/company-logos/denso.svg",
    sourceUrl: "https://www.denso.com/cn/zh/",
    status: "neutral-fallback",
  },
  horizon: {
    path: "/company-logos/horizon.ico",
    sourceUrl: "https://www.horizon.cc/favicon.ico",
    status: "official-favicon",
  },
  momenta: {
    path: "/company-logos/momenta.ico",
    sourceUrl: "https://www.momenta.cn/favicon.ico",
    status: "official-favicon",
  },
  "jingwei-hirain": {
    path: "/company-logos/jingwei-hirain.ico",
    sourceUrl: "https://www.hirain.com/favicon.ico",
    status: "official-favicon",
  },
  hesai: {
    path: "/company-logos/hesai.svg",
    sourceUrl: "https://www.hesaitech.com/cn/",
    status: "neutral-fallback",
  },
};

export function companyLogoPath(slugOrId: string | null | undefined): string | null {
  return slugOrId ? (COMPANY_LOGOS[slugOrId]?.path ?? null) : null;
}
