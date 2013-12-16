// UNDONE: These need to be adapted to QUnit and should call $cache

$(function () {
    var $providers = grain.cacheProviders;

    module("grain.cache", {
        setup: function () {
        },
        teardown: function () {
            // clean up after each test
        }
    });

    asyncTest('Cache Encapsulation Test', function() {
        var _cache1 = new grain.cache({ cacheProvider: new grain.cache.cacheProviders.pageRepository() });
        var _cache2 = new grain.cache({ cacheProvider: new grain.cache.cacheProviders.LocalStorageRepository('prefix', false) });

        notEqual(_cache1.getProvider.name, _cache2.getProvider().name, "should return separate providers if grain.cache is encapsulated correctly.");

        _cache1.set('1', 'foo');
        _cache2.set('1', 'hello');

        notEqual(_cache1.get('1'), _cache2.get('2'), "providers should return different values if they are encapsulated correctly.");

        start();
    });

    // Owner: Andy
    asyncTest('CacheProviders Test', function () {
        var $cache = new grain.cache();
        var _key = 'CacheProviders.Foo';
        var _value = 'bar';

        var testStores = [
                [$providers.localStorageRepository, "localStorageStore"],
                [$providers.pageRepository, "arrayStore"],
                [$providers.cookieRepository, "cookieStore"]
            ];

        for (i = 0 ; i < testStores.length ; i++) {
            strictEqual((typeof testStores[i][0]), "function", "provider should be instantiated");

            testStores[i][0] = testStores[i][0]();
            var _randKeyName = Math.random();

            strictEqual(testStores[i][0].exists(_randKeyName), false, "Exists should return false - a value doesn't exist");
            strictEqual(testStores[i][0].get(_randKeyName), undefined, "Get should return undefined - a value was not found");

            testStores[i][0].set(_key, _value);
            strictEqual(testStores[i][0].exists(_key), true, "Exists should return true - a value was found");
            strictEqual(testStores[i][0].get(_key), _value, 'Get should return _value');

            testStores[i][0].remove(_key);
            strictEqual(testStores[i][0].exists(_key), false, "Exists should return false - a value doesn't exist because it was removed");
            strictEqual(testStores[i][0].get(_key), undefined, "Get should return undefined - a value was not found because it was removed");

            testStores[i][0].set(_key, null);
            strictEqual(testStores[i][0].exists(_key), true, "Exists should return true - a value was found");
            strictEqual(testStores[i][0].get(_key), null, "Get should return null");

            testStores[i][0].set(_key, _value);
            //testStores[i][0].Set(_key,undefined);
            testStores[i][0].set(_key);
            strictEqual(testStores[i][0].exists(_key), false, "Exists should return false - a value doesn't exist because it was removed by Setting it to undefined");
            strictEqual(testStores[i][0].get(_key), undefined, "Get should return undefined - a value was not found because it was removed by Setting it to undefined");

            testStores[i][0].remove(_key);
        }

        start();
    });

    // Owner: Andy
    asyncTest('Set Value Test', function () {
        var $cache = new grain.cache();
        equal($cache.setProvider("").name, $providers.localStorageRepository().name, "should set the provider to a LocalStorageRepository when an invalid provider is passed to SetProvider");
        equal($cache.setProvider($providers.pageRepository()).name, $providers.pageRepository().name, "should be able to set the provider to any valid provider.");
        equal($cache.setProvider($providers.cookieRepository()).name, $providers.cookieRepository().name, "should be able to set the provider to any valid provider.");
        $cache.setProvider();

        var _randKeyName = Math.random();
        var _randValue = Math.random();
        strictEqual($cache.get(_randKeyName), null, "Get should return null, when trying to get the value for a key that doesn't exist in the cache");
        strictEqual($cache.getExpiration(_randKeyName), null, "GetExpiration should return null when trying to get the expiration time of an object that doesn't exist in the cache");

        $cache.setExpiration(_randKeyName, 1440);
        strictEqual($cache.get(_randKeyName), null, "Get should return null: setting the expiration for a key that doesn't exist should not result in an object being cached");
        strictEqual($cache.getExpiration(_randKeyName), null, "GetExpiration should return null: setting the expiration for a key that doesn't exist should not result in an object being cached with expiration");
        $cache.remove(_randKeyName);

        var _infKey = 'Set.infiniteKey';
        $cache.set(_infKey, _randValue);
        strictEqual($cache.get(_infKey), _randValue, "Get should return the value of the cached object");
        strictEqual($cache.getExpiration(_infKey), false, "GetExpiration should return false, when an object never expires");
        $cache.remove(_infKey);
        
        var _yesterKey = 'Set.yesterdayKey';
        var _yesterday = new Date().AddMinutes(-1440);
        $cache.set(_yesterKey, _randValue, _yesterday);
        strictEqual($cache.get(_yesterKey), null, "Get should return null when trying to retrieve an object from the cache, after it expired");
        strictEqual($cache.getExpiration(_yesterKey), null, "GetExpiration should return null when trying to retrieve an object from the cache, after it expired");
        $cache.remove(_yesterKey);

        var _tomorrowIntKey = 'Set.tomorrowIntKey';
        $cache.remove(_tomorrowIntKey);
        $cache.set(_tomorrowIntKey, _randValue, 1440);
        strictEqual($cache.get(_tomorrowIntKey), _randValue, "Get should return an object when it is set to expire in the future (duration-based expiration)");
        deepEqual($cache.getExpiration(_tomorrowIntKey), new Date().AddMinutes(1440), "GetExpiration should return a Date when it is set to expire in the future (duration-based expiration)");
        $cache.remove(_tomorrowIntKey);

        var _tomorrowKey = 'Set.tomorrowKey';
        var _tomorrow = new Date().AddMinutes(1440);
        $cache.set(_tomorrowKey, _randValue, _tomorrow);
        strictEqual($cache.get(_tomorrowKey), _randValue, "Get should return an object when it is set to expire in the future (time-based expiration)");
        deepEqual($cache.getExpiration(_tomorrowKey), _tomorrow, "GetExpiration should return a Date when it is set to expire in the future (time-based expiration)");
        $cache.remove(_tomorrowKey);

        start();
    });

    // Owner: Andy
    asyncTest('Update Value Test', function () {
        var $cache = new grain.cache();
        $cache.setProvider($providers.pageRepository)

        var _tomorrow = new Date().AddMinutes(1440);
        var _dayAfterTomorrow = new Date().AddMinutes(2880);
        var _yesterday = new Date().AddMinutes(-1440);
        var _randValue = Math.random();
        var _newValue = 'new value';
        var _infKey = 'Update.infiniteKey';
        var _yesterKey = 'Update.yesterdayKey';
        var _tomorrowKey = 'Update.tomorrowKey';

        $cache.set(_infKey, _randValue);
        $cache.set(_yesterKey, _randValue, _yesterday);
        $cache.set(_tomorrowKey, _randValue, _tomorrow);

        $cache.set(_infKey, _newValue);
        strictEqual($cache.get(_infKey), _newValue, "Read value of infinite key, modified using Set");
        strictEqual($cache.getExpiration(_infKey), false, "Read expiry of infinite key, modified using Set");

        $cache.setExpiration(_infKey, _tomorrow);
        strictEqual($cache.get(_infKey), _newValue, "Read value of infinite key, modified using SetExpiration");
        deepEqual($cache.getExpiration(_infKey), _tomorrow, "Read expiry of infinite key, modified using SetExpiration");

        $cache.setExpiration(_infKey, _yesterday);
        strictEqual($cache.get(_infKey), null, "Read value of infinite key, modified using SetExpiration to be expired");
        strictEqual($cache.getExpiration(_infKey), null, "Read expiry of infinite key, modified using SetExpiration to be expired");

        $cache.set(_tomorrowKey, _newValue);
        strictEqual($cache.get(_tomorrowKey), _newValue, "Read value of finite key, modified using Set");
        deepEqual($cache.getExpiration(_tomorrowKey), _tomorrow, "Read expiry of finite key, modified using Set");

        $cache.setExpiration(_tomorrowKey, _dayAfterTomorrow);
        strictEqual($cache.get(_tomorrowKey), _newValue, "Read value of finite key, modified using SetExpiration");
        deepEqual($cache.getExpiration(_tomorrowKey), _dayAfterTomorrow, "Read expiry of finite key, modified using SetExpiration");

        $cache.setExpiration(_tomorrowKey, _yesterday);
        strictEqual($cache.get(_tomorrowKey), null, "Read value of finite key, modified using SetExpiration to be expired");
        strictEqual($cache.getExpiration(_tomorrowKey), null, "Read expiry of finite key, modified using SetExpiration to be expired");

        $cache.set(_yesterKey, _newValue);
        strictEqual($cache.get(_yesterKey), _newValue, "Read value of previously-expired key, modified using Set");
        strictEqual($cache.getExpiration(_yesterKey), false, "Read expiry of previously-expired key, modified using Set");

        // expire again
        $cache.setExpiration(_yesterKey, _yesterday);

        $cache.setExpiration(_yesterKey, _tomorrow);
        strictEqual($cache.get(_yesterKey), null, "Read value of previously-expired key, modified using SetExpiration");
        strictEqual($cache.getExpiration(_yesterKey), null, "Read expiry of previously-expired key, modified using SetExpiration");

        $cache.setExpiration(_yesterKey, _yesterday);
        strictEqual($cache.get(_yesterKey), null, "Read value of previously-expired key, modified using SetExpiration to be expired");
        strictEqual($cache.getExpiration(_yesterKey), null, "Read expiry of previously-expired key, modified using SetExpiration to be expired");

        $cache.remove(_infKey);
        $cache.remove(_yesterKey);
        $cache.remove(_tomorrowKey);

        start();
    });

    // Owner: Andy
    test('Refresh Test', function () {
        var $cache = new grain.cache();
        $cache.set('foo', 'bar');
        strictEqual($cache.get('foo'), 'bar', 'Get should return a value (LocalStorageRepository)');

        $cache.clear();
        strictEqual($cache.get('foo'), null, 'Get should not return a value after the cache was cleared (LocalStorageRepository)');

        $cache.setProvider($providers.pageRepository);
        $cache.set('foo', 'bar');
        strictEqual($cache.get('foo'), 'bar', 'Get should return a value (PageRepository)');

        $cache.clear();
        strictEqual($cache.get('foo'), null, 'Get should not return a value after the cache was cleared (PageRepository)');
    });

    // Owner: Andy
    test('RemoveGroup Test', function () {
        var $cache = new grain.cache({
            cacheProvider: $providers.localStorageRepository('Test')
        });
        $cache.set('Group.foo', 'bar');
        strictEqual($cache.get('Group.foo'), 'bar', 'Get should return a value (LocalStorageRepository)');
        strictEqual(localStorage.getItem('Test.Group.foo'), "{\"value\":\"bar\",\"expiration\":null}", 'localStorage.getItem should return a value with the appropriate groupName (LocalStorageRepository)');

        $cache.set('Group.test', 'bar');
        $cache.set('Group.hello', 'world');
        $cache.set('Group.bar', 'foo');
        var _removedCount = $cache.removeGroup('Group.');
        ok(typeof (_removedCount) == 'number' && _removedCount == 4, 'RemoveGroup should return an integer equal to the number of items removed from the cache');
        strictEqual($cache.get('Group.foo'), null, 'Get should not return a value after the group was cleared (LocalStorageRepository)');

        $cache.set('Group.foo', 'bar');
        $cache.set('Group.test', 'bar');
        $cache.set('Group.hello', 'world');
        $cache.set('Group.bar', 'foo');
        var _removedCount = $cache.removeGroup();
        ok(typeof (_removedCount) == 'number' && _removedCount == 4, 'RemoveGroup (entire repo) should return an integer equal to the number of items removed from the cache');
        strictEqual($cache.get('Group.foo'), null, 'Get should not return a value after the group was cleared (LocalStorageRepository)');
    });
});