import { useState, useEffect, useMemo } from 'react';
import { arrayOf, bool, number, shape, string } from 'prop-types';
import { IconSearchLine } from '@instructure/ui-icons'
import { Link } from '@instructure/ui-link';
import { List } from '@instructure/ui-list';
import { Spinner } from '@instructure/ui-spinner';
import { Text } from '@instructure/ui-text';
import { TextInput } from '@instructure/ui-text-input';
import { View } from '@instructure/ui-view';
import styles from '../styles/Home.module.css';
import { debounce } from 'lodash';
import parseLinkHeader from 'parse-link-header';

const NRESULTS = 5;
const TYPING_DEBOUNCE = 500;
const MIN_SEARCH_LENGTH = 3
const SEARCH_ENDPOINT = '/api/search';

const convertResults = r => r.map(h => ({ id: h.id, name: h.name, url: 'https://' + h.domain }));

function MoreMessage({ pages }) {
  if (pages === 1) return null;
  let message = '... and <b>many</b> more not shown here';
  if (pages <= 10) message = '... and more not shown here';
  if (pages <= 3) message = '... and a few more not shown here';
  return <Text dangerouslySetInnerHTML={{__html: message}} />
}

MoreMessage.propTypes = {
  pages: number.isRequired
};

function ResultsArea({ results, pages, isLoading }) {
  if (isLoading) return <Spinner size="large" renderTitle="Waiting for results to load" />;
  if (typeof results === 'undefined') return null;
  if (results.length === 0) {
    return (
      <View as="div" margin="medium none">
        <Text>Sorry, we couldn&apos;t find anything that matched.</Text>
      </View>
    );
  }
  return (
    <View as="div" margin="medium none">
      <List isUnstyled={true} margin="small none">
        {results.map(r => (
          <List.Item key={r.id}>
            <Link href={r.url}>
              {r.name}
            </Link>
          </List.Item>
        ))}
      </List>
      <MoreMessage pages={pages} />
    </View>
  )
}

ResultsArea.propTypes = {
  results: arrayOf(
    shape({
      id: number.isRequired,
      name: string.isRequired,
      url: string.isRequired
    })
  ),
  pages: number.isRequired,
  isLoading: bool.isRequired
};

const HelpBlurb = () => (
  <View as="div" margin="large none">
    <hr />
    <Text weight="bold">Didn&apos;t find what you are looking for? Keep trying!</Text>
    <List>
      <List.Item>Make sure that you are spelling your institution correctly.</List.Item>
      <List.Item>Try adding names/titles that are specific to your institution.</List.Item>
      <List.Item>Try entering your institution&apos;s complete name.</List.Item>
      <List.Item>
        Still having difficulty? Get more help here:&nbsp;
        <Link href="https://www.instructure.com">Canvas Guides</Link>
      </List.Item>
    </List>
  </View>
);

export default function HostFinderModal() {
  const updateSearchTerm = useMemo(
    () =>
      debounce(v => {
        setSearchTerm(v)
      }, TYPING_DEBOUNCE),
    []
  );
  const [ host, setHost ] = useState('');
  const [ searchTerm, setSearchTerm ] = useState('');
  const [ isLoading, setIsLoading ] = useState(false);
  const [ pages, setPages ] = useState(0);
  const [ results, setResults ] = useState(undefined);

  const resultsProps = {results, pages, isLoading};
  const shouldShowHelp = typeof results !== 'undefined' && !isLoading;

  let messages = null;
  if (host.length < MIN_SEARCH_LENGTH) {
    messages = [
      {
        type: host.length > 0 ? 'error' : 'hint',
        text: `Type at least ${MIN_SEARCH_LENGTH} characters to search`
      }
    ]
  }

  function onNewSearchTerm() {
    if (searchTerm === '') {
      setResults(undefined);
      return;
    }

    const aborter = new AbortController();
    let aborting = false;

    async function fetchHosts() {
      try {
        setIsLoading(true);
        const query = new URLSearchParams({ name: searchTerm, per_page: NRESULTS }).toString();
        const url = `${SEARCH_ENDPOINT}?${query}`;
        const response = await fetch(url, { signal: aborter.signal });
        if (aborting) return;
        if (!response.ok) {
          const err = new Error(`Bad API response: ${response.status} ${response.statusText}`);
          Object.assign(err, { response });
          throw err;
        }
        const linkHeader = response.headers.get('Link');
        const link = linkHeader && parseLinkHeader(linkHeader)
        const json = await response.json();
        setResults(convertResults(json));
        setPages(parseInt(link?.last?.page || 1, 10));
      } catch (err) {
        if (!aborting) console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHosts();

    return () => {
      aborting = true;
      aborter.abort();
    };
  }

  function renderModalBody() {
    return (
      <div className={styles.modalEnclosure}>
        <TextInput
          type="search"
          value={host}
          renderLabel="Search for your school or institution"
          placeholder="Search…"
          onChange={updateSearch}
          messages={messages}
          renderBeforeInput={<IconSearchLine inline={false} />}
        />
        <ResultsArea {...resultsProps} />
        {shouldShowHelp && <HelpBlurb />}
      </div>
    );
  }

  function updateSearch(e) {
    setHost(e.target.value);
    if (e.target.value.length < MIN_SEARCH_LENGTH) {
      updateSearchTerm.cancel();
      setSearchTerm('');
      return;
    }
    updateSearchTerm(e.target.value);
  }

  useEffect(onNewSearchTerm, [searchTerm]);

  return renderModalBody();
}
