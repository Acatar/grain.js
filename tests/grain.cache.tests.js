// UNDONE: These need to be adapted to QUnit and should call $cache

$(function () {
    var $providers = Grain.CacheProviders;

    module("grain.cache", {
        setup: function () {
        },
        teardown: function () {
            // clean up after each test
        }
    });

    // Owner: Andy
    asyncTest('CacheProviders Test', function () {
        var $cache = new Grain.Cache();
        var _key = 'CacheProviders.Foo';
        var _value = 'bar';

        var testStores = [[$providers.LocalStorageRepository, "localStorageStore"], [$providers.PageRepository, "arrayStore"]];

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
        var $cache = new Grain.Cache();
        equal($cache.SetProvider("").Name, $providers.LocalStorageRepository().Name, "should set the provider to a LocalStorageRepository when an invalid provider is passed to SetProvider");
        equal($cache.SetProvider($providers.PageRepository).Name, $providers.PageRepository().Name, "should be able to set the provider to any valid provider.");
        $cache.SetProvider();

        var _randKeyName = Math.random();
        var _randValue = Math.random();
        strictEqual($cache.Get(_randKeyName), null, "Get should return null, when trying to get the value for a key that doesn't exist in the cache");
        strictEqual($cache.GetExpiration(_randKeyName), null, "GetExpiration should return null when trying to get the expiration time of an object that doesn't exist in the cache");

        $cache.SetExpiration(_randKeyName, 1440);
        strictEqual($cache.Get(_randKeyName), null, "Get should return null: setting the expiration for a key that doesn't exist should not result in an object being cached");
        strictEqual($cache.GetExpiration(_randKeyName), null, "GetExpiration should return null: setting the expiration for a key that doesn't exist should not result in an object being cached with expiration");
        $cache.Remove(_randKeyName);

        var _infKey = 'Set.infiniteKey';
        $cache.Set(_infKey, _randValue);
        strictEqual($cache.Get(_infKey), _randValue, "Get should return the value of the cached object");
        strictEqual($cache.GetExpiration(_infKey), false, "GetExpiration should return false, when an object never expires");
        $cache.Remove(_infKey);
        
        var _yesterKey = 'Set.yesterdayKey';
        var _yesterday = new Date().AddMinutes(-1440);
        $cache.Set(_yesterKey, _randValue, _yesterday);
        strictEqual($cache.Get(_yesterKey), null, "Get should return null when trying to retrieve an object from the cache, after it expired");
        strictEqual($cache.GetExpiration(_yesterKey), null, "GetExpiration should return null when trying to retrieve an object from the cache, after it expired");
        $cache.Remove(_yesterKey);

        var _tomorrowIntKey = 'Set.tomorrowIntKey';
        $cache.Remove(_tomorrowIntKey);
        $cache.Set(_tomorrowIntKey, _randValue, 1440);
        strictEqual($cache.Get(_tomorrowIntKey), _randValue, "Get should return an object when it is set to expire in the future (duration-based expiration)");
        deepEqual($cache.GetExpiration(_tomorrowIntKey), new Date().AddMinutes(1440), "GetExpiration should return a Date when it is set to expire in the future (duration-based expiration)");
        $cache.Remove(_tomorrowIntKey);

        var _tomorrowKey = 'Set.tomorrowKey';
        var _tomorrow = new Date().AddMinutes(1440);
        $cache.Set(_tomorrowKey, _randValue, _tomorrow);
        strictEqual($cache.Get(_tomorrowKey), _randValue, "Get should return an object when it is set to expire in the future (time-based expiration)");
        deepEqual($cache.GetExpiration(_tomorrowKey), _tomorrow, "GetExpiration should return a Date when it is set to expire in the future (time-based expiration)");
        $cache.Remove(_tomorrowKey);

        start();
    });

    // Owner: Andy
    asyncTest('Update Value Test', function () {
        var $cache = new Grain.Cache();
        $cache.SetProvider($providers.PageRepository)

        var _tomorrow = new Date().AddMinutes(1440);
        var _dayAfterTomorrow = new Date().AddMinutes(2880);
        var _yesterday = new Date().AddMinutes(-1440);
        var _randValue = Math.random();
        var _newValue = 'new value';
        var _infKey = 'Update.infiniteKey';
        var _yesterKey = 'Update.yesterdayKey';
        var _tomorrowKey = 'Update.tomorrowKey';

        $cache.Set(_infKey, _randValue);
        $cache.Set(_yesterKey, _randValue, _yesterday);
        $cache.Set(_tomorrowKey, _randValue, _tomorrow);

        $cache.Set(_infKey, _newValue);
        strictEqual($cache.Get(_infKey), _newValue, "Read value of infinite key, modified using Set");
        strictEqual($cache.GetExpiration(_infKey), false, "Read expiry of infinite key, modified using Set");

        $cache.SetExpiration(_infKey, _tomorrow);
        strictEqual($cache.Get(_infKey), _newValue, "Read value of infinite key, modified using SetExpiration");
        deepEqual($cache.GetExpiration(_infKey), _tomorrow, "Read expiry of infinite key, modified using SetExpiration");

        $cache.SetExpiration(_infKey, _yesterday);
        strictEqual($cache.Get(_infKey), null, "Read value of infinite key, modified using SetExpiration to be expired");
        strictEqual($cache.GetExpiration(_infKey), null, "Read expiry of infinite key, modified using SetExpiration to be expired");

        $cache.Set(_tomorrowKey, _newValue);
        strictEqual($cache.Get(_tomorrowKey), _newValue, "Read value of finite key, modified using Set");
        deepEqual($cache.GetExpiration(_tomorrowKey), _tomorrow, "Read expiry of finite key, modified using Set");

        $cache.SetExpiration(_tomorrowKey, _dayAfterTomorrow);
        strictEqual($cache.Get(_tomorrowKey), _newValue, "Read value of finite key, modified using SetExpiration");
        deepEqual($cache.GetExpiration(_tomorrowKey), _dayAfterTomorrow, "Read expiry of finite key, modified using SetExpiration");

        $cache.SetExpiration(_tomorrowKey, _yesterday);
        strictEqual($cache.Get(_tomorrowKey), null, "Read value of finite key, modified using SetExpiration to be expired");
        strictEqual($cache.GetExpiration(_tomorrowKey), null, "Read expiry of finite key, modified using SetExpiration to be expired");

        $cache.Set(_yesterKey, _newValue);
        strictEqual($cache.Get(_yesterKey), _newValue, "Read value of previously-expired key, modified using Set");
        strictEqual($cache.GetExpiration(_yesterKey), false, "Read expiry of previously-expired key, modified using Set");

        // expire again
        $cache.SetExpiration(_yesterKey, _yesterday);

        $cache.SetExpiration(_yesterKey, _tomorrow);
        strictEqual($cache.Get(_yesterKey), null, "Read value of previously-expired key, modified using SetExpiration");
        strictEqual($cache.GetExpiration(_yesterKey), null, "Read expiry of previously-expired key, modified using SetExpiration");

        $cache.SetExpiration(_yesterKey, _yesterday);
        strictEqual($cache.Get(_yesterKey), null, "Read value of previously-expired key, modified using SetExpiration to be expired");
        strictEqual($cache.GetExpiration(_yesterKey), null, "Read expiry of previously-expired key, modified using SetExpiration to be expired");

        $cache.Remove(_infKey);
        $cache.Remove(_yesterKey);
        $cache.Remove(_tomorrowKey);

        start();
    });

    // Owner: Andy
    test('Refresh Test', function () {
        var $cache = new Grain.Cache();
        $cache.Set('foo', 'bar');
        strictEqual($cache.Get('foo'), 'bar', 'Get should return a value (LocalStorageRepository)');

        $cache.Clear();
        strictEqual($cache.Get('foo'), null, 'Get should not return a value after the cache was cleared (LocalStorageRepository)');

        $cache.SetProvider($providers.PageRepository);
        $cache.Set('foo', 'bar');
        strictEqual($cache.Get('foo'), 'bar', 'Get should return a value (PageRepository)');

        $cache.Clear();
        strictEqual($cache.Get('foo'), null, 'Get should not return a value after the cache was cleared (PageRepository)');
    });

    // Owner: Andy
    test('RemoveGroup Test', function () {
        var $cache = new Grain.Cache({
            CacheProvider: $providers.LocalStorageRepository('Test')
        });
        $cache.Set('Group.foo', 'bar');
        strictEqual($cache.Get('Group.foo'), 'bar', 'Get should return a value (LocalStorageRepository)');
        strictEqual(localStorage.getItem('Test.Group.foo'), "{\"value\":\"bar\",\"expiration\":null}", 'localStorage.getItem should return a value with the appropriate groupName (LocalStorageRepository)');

        $cache.Set('Group.test', 'bar');
        $cache.Set('Group.hello', 'world');
        $cache.Set('Group.bar', 'foo');
        var _removedCount = $cache.RemoveGroup('Group.');
        ok(typeof (_removedCount) == 'number' && _removedCount == 4, 'RemoveGroup should return an integer equal to the number of items removed from the cache');
        strictEqual($cache.Get('Group.foo'), null, 'Get should not return a value after the group was cleared (LocalStorageRepository)');

        $cache.Set('Group.foo', 'bar');
        $cache.Set('Group.test', 'bar');
        $cache.Set('Group.hello', 'world');
        $cache.Set('Group.bar', 'foo');
        var _removedCount = $cache.RemoveGroup();
        ok(typeof (_removedCount) == 'number' && _removedCount == 4, 'RemoveGroup (entire repo) should return an integer equal to the number of items removed from the cache');
        strictEqual($cache.Get('Group.foo'), null, 'Get should not return a value after the group was cleared (LocalStorageRepository)');
    });
});