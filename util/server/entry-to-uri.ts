import { BCMSEntryParsed } from '@becomes/cms-client/types';
import { BCMSMost, BCMSMostCacheHandler } from '@becomes/cms-most/types';
import { Locale } from '~/types';

const entryTemplateMap = {
  // '60caf7939f46890028f00cf3': {
  //   entryId: '633ebce454cbaa2867a7d384',
  //   templateName: 'blog_home',
  // },
};

export async function entryToUrlWithCache(
  cache: BCMSMostCacheHandler,
  entry: BCMSEntryParsed,
  lng: Locale,
): Promise<string> {
  if (!entry.meta[lng]) {
    return '/';
  }
  const parentTemplateInfo = entryTemplateMap[entry.templateId];
  if (!parentTemplateInfo) {
    return `/${entry.meta[lng].slug || ''}`;
  }
  const parentEntry = await cache.content.findOne(
    e => e._id === parentTemplateInfo.entryId,
    true,
  );
  if (!parentEntry || parentEntry._id === entry._id) {
    return `/${entry.meta[lng].slug || ''}`;
  }
  return `${await entryToUrlWithCache(cache, parentEntry, lng)}/${
    entry.meta[lng].slug || ''
  }`;
}

export async function entryToUrl(
  most: BCMSMost,
  entry: BCMSEntryParsed,
  lng: Locale,
): Promise<string> {
  if (!entry.meta[lng]) {
    return '/';
  }
  const parentTemplateInfo = entryTemplateMap[entry.templateId];
  if (!parentTemplateInfo) {
    return `/${entry.meta[lng].slug || ''}`;
  }
  const parentEntry = await most.content.entry.findOne(
    parentTemplateInfo.templateName,
    async e => e._id === parentTemplateInfo.entryId,
  );
  if (!parentEntry || parentEntry._id === entry._id) {
    return `/${entry.meta[lng].slug || ''}`;
  }
  return `${await entryToUrl(most, parentEntry, lng)}/${
    entry.meta[lng].slug || ''
  }`;
}
